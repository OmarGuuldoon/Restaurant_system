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
    let contactNumber = req.body.contactNumber;
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
        const insertionQuery = "INSERT INTO user (name, contactNumber, email, password, status, role) VALUES (?,?,?,?,'false','user')";
        await db_connection.query(insertionQuery, [username, contactNumber, email, password, status, role]);

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

        const passwordIsValid = bcrypt.compareSync(req.body.password, result[0].password);

        console.log("Password is valid:", passwordIsValid);
        if (!passwordIsValid) {
            console.log("Incorrect Credentials");
            return res.status(401).json({ message: "Incorrect Credentials" });
        }

        if (result[0].status === false || result[0].status.trim() === 'false') {
            console.log("Wait for Admin Approval: User status is false");
            return res.status(401).json({ message: "Wait for Admin Approval..." });
            console.log("User status:", result[0].status, typeof result[0].status);

        }

        
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
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

const forgotPassword = async (req ,res) => {
    const user = req.body;
    try {
         checkEmailQuery = "SELECT email FROM user WHERE email = ?"; 
        [result] = await db_connection.query(checkEmailQuery, user.email);   

        if(!checkEmailQuery) {
            console.log("Email not Found, Please sign up");
            return res.status(401).json({
                message : "Email was not found Pleas sign up.. "
            })
        }

        var mailOptions = {
            from : process.env.EMAIL,
            to : result[0].email,
            subject : 'Password cafe managment System',
            html : '<p><b>Your log in details for cafe managment system</b> <br><b>'  +result[0].email + ' </b> ' + result[0].password + '<br> <a> href="http://localhost:3025/"/>Click Here to Login</a></p>',
        };
        transporter.sendMail({
            mailOptions
        });
        console.log("Email Sent : "); 


    }
    catch (err) {
        console.log("INTERNAL SERVER ERRROR!");
        return res.status(500).json({
            message : "INTERNAL SERVER ERROR!"
        })
    }
}
const getUsersByRole = async (req, res) => {
    const role = req.query.role || 'user';  // Set 'user' as the default role

    try {
        const query = "SELECT id, name, email, contactnumber, status FROM user WHERE role = ?";
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


const updateStatus = async (req, res, next) => {
    let user = req.body;
    try {
        var query = "update user set status = ? where id = ?";
        const [result] = await db_connection.query(query, [user.status, user.id]);

        if(result.affectedRows === 0) {
            return res.status(404).json({
                message : "status id was not found"
            })
        }

        return res.status(201).json("Status updated succesfully")
    }
    catch(error) {
        return res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }
}


const updateUser = async (req, res) => {
    const user = req.body;
    try {
        // Ensure the query matches the fields you intend to update
        const updateQuery = "UPDATE user SET name = ?, email = ?, password = ?, status = ?, role = ? WHERE id = ?";
        
        // Remove the extra 'user.contactNumber' in the values array
        const result = await db_connection.query(updateQuery, [user.name, user.email, user.password, user.status, user.role, user.id]);

        // Check if any rows were affected
        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                message: "User ID does not exist"
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        // Log the error for debugging purposes
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


export default { updateStatus,userRegistration, userLogin, forgotPassword, updateUser, checkToken, getUsersByRole, changePassword, getUsers};