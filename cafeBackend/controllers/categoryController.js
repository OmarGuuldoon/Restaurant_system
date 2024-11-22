import ('dotenv/config');
import express, { query, Router } from 'express';
import db_connection from '../configuration.js';
import config from '../auth.js';



const addCategory = async (req, res) => {// Log the whole request body
    let category = req.body.category; // Get the category object from the body
    console.log(category); 
// Log the category object

    try {
        // Assuming you're passing 'category.name' from the body
        const query = "INSERT INTO category (name) VALUES(?)";
        const [result] = await db_connection.query(query,[category]);

        if(result.length === 0) {
            return res.status(404).json({
                message : "no category was inserted"
            })
        }

        console.log(result);  // Log the result of the query

        return res.status(200).json({ message: "Category added successfully" });
    } catch (err) {
        console.log("Error adding category:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const selectCategories = async (req, res, next) => {
    try {
        const query = "SELECT * FROM category order by name";
        const [result] = await db_connection.query(query);

        if(result.length === 0) {
            return res.status(401).json({
                message : "no categories has been found"
            })
        }
        return res.status(201).json({
            message : result
        })

    }
    catch(error) {
        return res.status(500).json({
            message : "internal server error!",
            error : error.message
        })
    }
    next();
}

const updateCategory = async (req, res, next) => {

    let category = req.body;
    try {
        var query = "update category set name=? where id=?";
        const [result] = await db_connection.query(query, [category.category, category.id]);

        if(result.affectedRows === 0) {
            return res.status(404).json({
                message : "category not found"
            })
        }

        return res.status(201).json({
            message : "category updated"
        });
    }
    catch(error) {
        res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }
}
export default {addCategory, selectCategories, updateCategory}