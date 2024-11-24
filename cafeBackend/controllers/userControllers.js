import ('dotenv/config');
import express, { query, Router } from 'express';
import db_connection from '../configuration.js';
import jwt from 'jsonwebtoken';
import config from '../auth.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';


const userRegistration = async (req, res) => {
    let username = req.body.name;
    let email = req.body.email;
    let confirmPassword = req.body.confirmPassword;
    let password = req.body.password;
    let contact = req.body.contact;
    let status = req.body.status;
    let role = req.body.role;
    console.log("Recieved Signup Request : ");
    try {
        const checkEmailQuery = "SELECT email FROM user WHERE email = ?";
        const [result] = await db_connection.query(checkEmailQuery, [email]);

        if (result.length > 0) {
            console.log("User Already Exists. ");
            return res.status(400).json({
                message: "User Already Exist"
            })
        }
        if (password !== confirmPassword) {
            return res.json ({
                message : "Passwords does not match"
            })
        }

        password = bcrypt.hashSync(req.body.password,8);
        console.log("User not Found, Registering New User");
        const insertionQuery = "INSERT INTO user(name, contact, email, password, status, role) VALUES(?,?,?,?,'false','user')";
        await db_connection.query(insertionQuery, [username, contact, email, password, status, role]);

        console.log("User Registered Succesfully");
        return res.status(201).json({
            message: "User Register Succesfully"
        })

    }
    catch (err) {

        console.log("DATABASE error ", err);
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR"
        })
    }
}



const userLogin = async (req, res) => {
    let user = req.body;
    console.log("Received Login Credentials:", user);

    try {
        const userQuery = "SELECT id, email, password, role, status FROM user WHERE email = ?";
        const [result] = await db_connection.query(userQuery, [user.email]);

        if (result.length === 0) {
            console.log("Email not found");
            return res.status(404).json({ message: "Email not found. Please sign up." });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, result[0].password);

        console.log("Password is valid:", passwordIsValid);
        if (!passwordIsValid) {
            console.log("Incorrect Credentials");
            return res.status(401).json({ message: "Incorrect Credentials" });
        }

        if (!result[0].status || result[0].status.trim() === 'false') {
            console.log("Wait for Admin Approval: User status is false");
            return res.status(401).json({ message: "Wait for Admin Approval..." });
        }

        const accessToken = jwt.sign(
            {
                id: result[0].id,
                email: result[0].email,
                role: result[0].role,
            },
            process.env.JWT_SECRET, // Using the environment variable directly
            {
                algorithm: 'HS256',
                expiresIn: 86400,
            }
        );

        console.log("User logged in successfully");
        return res.status(201).json({
            message: "User logged in successfully",
            token: accessToken,
            user: {
                userId: result[0].id,
                userName: user.name,
                userEmail: result[0].email,
                userRole: result[0].role,
            },
        });

    } catch (err) {
        console.error("INTERNAL SERVER ERROR:", err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};


var transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL,
        pass : process.env.PASSWORD
    }
})

const forgotPassword = async (req, res) => {
    const user = req.body;
    try {
        const checkEmailQuery = "SELECT email, password FROM user WHERE email = ?"; 
        const [result] = await db_connection.query(checkEmailQuery, [user.email]);   
        
        // Validate if the email exists in the database
        if (!result || result.length === 0) {
            console.log("Email not Found, Please sign up");
            return res.status(401).json({
                message: "Email was not found. Please sign up."
            });
        }

        // Set up mail options
        const mailOptions = {
            from: process.env.EMAIL,
            to: result[0].email,
            subject: 'Password for Cafe Management System',
            html: `<p><b>Your login details for Cafe Management System:</b><br>
                   Email: <b>${result[0].email}</b><br>
                   Password: <b>${result[0].password}</b><br>
                   <a href="http://localhost:3025/">Click Here to Login</a></p>`,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({
                    message: "Failed to send email."
                });
            }
            console.log("Email Sent:", info.response);
            res.status(200).json({
                message: "Password sent to your email."
            });
        });
    } catch (err) {
        console.error("INTERNAL SERVER ERROR:", err);
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR!"
        });
    }
};


const getUsersByRole = async (req, res) => {
    const role = req.query.role || 'user';  // Set 'user' as the default role

    try {
        const query = "SELECT id, name, email, contact, status FROM user WHERE role = ?";
        const [results] = await db_connection.query(query, [role]);

        if (results.length === 0) {
            return res.status(404).json({ message: `No users found with role ${role}` });
        }

        return res.status(200).json(results);
    } catch (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
    }
};


const getUsers = async (req, res) => {


    try {
        const query = "SELECT * FROM user";
        const [results] = await db_connection.query(query);

        if (results.length === 0) {
            return res.status(404).json({ message: `No users found with role ${role}` });
        }

        return res.status(200).json(results);
    } catch (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database error' });
    }
};


const updateUserStatus = async (req, res) => {
    const { id, status } = req.body;

    try {
        const updateQuery = "UPDATE user SET status = ? WHERE id = ?";
        const result = await db_connection.query(updateQuery, [status, id]);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: "User ID does not exist" });
        }

        return res.status(200).json({ message: "User status updated successfully" });
    } catch (error) {
        console.error("INTERNAL SERVER ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const updateUser = async (req, res) => {
    const user = req.body;
    try {
        const updateQuery = "UPDATE user SET name = ?, email = ?, password = ?, status = ?, role = ? WHERE id = ?";
        const result = await db_connection.query(updateQuery, [user.name, user.email, user.password, user.status, user.role, user.id]);

        // Check if any rows were affected
        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                message: "User ID does not exist"
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("INTERNAL SERVER ERROR:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
const checkToken = async (req, res) => {
    try {
        return res.status(201).json({
            message : "true",
        })
    }
    catch {
        return res.status(500).json({
            message : "INTERNAL SERVER ERRROR!"
        })
    }
}

const changePassword = async (req, res) => {
    const user = req.body;
    const email = res.locals.user.email;
    console.log(email);

    try {

        const query = "SELECT * FROM user WHERE email = ?";
        const [result] = await db_connection.query(query, [email]);

        if (result.length === 0) {
            return res.status(404).json({
                message: "USER NOT FOUND",
            });
        }

        const passwordIsValid = bcrypt.compareSync(user.oldPassword, result[0].password);
        if (!passwordIsValid) {
            return res.status(400).json({
                message: "INVALID PASSWORD",
            });
        }

        const hashedNewPassword = bcrypt.hashSync(user.newPassword, 10);
        const changePasswordQuery = "UPDATE user SET password = ? WHERE email = ?";
        await db_connection.query(changePasswordQuery, [hashedNewPassword, email]);

        return res.status(200).json({
            message: "Password changed successfully",
        });

    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
        });
    }
};


export default {updateUserStatus,userRegistration, userLogin, forgotPassword, updateUser, checkToken, getUsersByRole, changePassword, getUsers};