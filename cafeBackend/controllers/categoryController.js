import ('dotenv/config');
import express, { query, Router } from 'express';
import db_connection from '../configuration.js';
import config from '../auth.js';



const addCategory = async (req, res) => {
    const category = req.body; // Expecting category.name from the request body
    console.log(category); 

    try {
        const query = "INSERT INTO category (name) VALUES(?)";
        const [result] = await db_connection.query(query, [category.name]); // Use square brackets for parameterized query

        // Check if the insertion was successful
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "No category was inserted",
            });
        }

        // Successful insertion
        return res.status(200).json({
            message: "Category added successfully",
            data: result, // Optionally include result for debugging or further use
        });
    } catch (err) {
        console.error("Error adding category:", err);

        // Return internal server error
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};


const selectCategories = async (req, res, next) => {
    try {
        const query = "SELECT * FROM category order by name";
        const [result] = await db_connection.query(query);

        if(result.length === 0) {
            return res.status(404).json({
                message : "no categories has been found"
            })
        }
        return res.status(201).json(result)

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
    console.log(category);
    try {
        var query = "update category set name=? where id=?";
        const [result] = await db_connection.query(query, [category.name, category.id]);

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


const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id; // Capture the ID from the URL

    try {
        const query = "DELETE FROM category WHERE id = ?";
        const [result] = await db_connection.query(query, [categoryId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "ID not found",
            });
        }

        return res.status(200).json({
             message : "Category deleted successfully"},
        );
    } catch (error) {
        console.error("Database error:", error.message);

        // If an error occurs, send a 500 response
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export default {addCategory, selectCategories, updateCategory,deleteCategory}