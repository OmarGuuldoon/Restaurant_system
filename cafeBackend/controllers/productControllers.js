import ('dotenv/config');
import express, { query, Router } from 'express';
import db_connection from '../configuration.js';
import config from '../auth.js';
import db from '../configuration.js';


const addProduct = async (req, res, next) => {
    console.log(req.body);
    let product = req.body;
    console.log(product);
    
    try {
        const addQuery = "INSERT INTO product (name, categoryId, description, price, status) VALUES(?,?,?,?,?)";
        const [result] = await db_connection.query(addQuery, [product.name, product.categoryId, product.description, product.price, product.status]);

        if(result.length == 0){
            res.status(404).json({
                error : error.message
            })
        }

        return res.status(201).json({
            message : "product Added succesfully"
        })
    }
    catch(error) {
        return res.status(500).json({
            message : "INTERNAL SERVER ERROR!",
            error : error.message
        })
    }
}

const selectProducts = async (req, res, next) => {
    try {
        var query = "select p.id, p.name, p.description, p.status, p.price, c.id as categoryId,c.name as categoryName from product as p JOIN category as c  where p.categoryId=c.id";
        const [result] = await db_connection.query(query);

        // Check if no products are found
        if (result.length === 0) {
            return res.status(404).json({
                message: "No product was found"
            });
        }

        // Send the result if products are found
        return res.status(200).json(result);
    } catch (error) {
        // Catch and handle errors
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
}

const selectProductById = async (req, res, next) => {
    const {id} = req.params;

    try {
        const query = "SELECT id, name, description, price from product where id = ? ",
        [result] = await db_connection.query(query, id);

        if(result.length == 0) {
            return res.status(404).json({
                message : "no product was found"
            })
        }
        return res.status(201).json(result)
    }
    catch (error) {
        return res.status(500).json({
            message : "internal server error!",
            error : error.message
        })
    }

}
const updateProduct = async (req, res, next) => {
    const product = req.body;

    try {
        var query = "update product set name = ? ,categoryId = ? , description = ? ,price = ? where  id = ?";
        const [result] = await db_connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id]);

        if(result.length == 0) {
            return res.status(404).json({
                message : "something went wrong"
            })
        }
        return res.status(201).json({message :"product updated succesfuly"})
    }
    catch(error) {
        return res.status(500).json({
            message : "internal server errror",
            error : error.message
        })
    }
}
const deleteProduct = async (req, res, next) => {
    const productId = req.params.id;

    try {
        let query ="delete from product where id = ?";
        const [result] = await db_connection.query(query, [productId]) 

        if(result.affectedRows === 0 ){
            res.status(404).json({
                message : "id not found"
            })
        }
        return res.status(201).json({ message : "product deleted successfully"})
    }
    catch(error) {
        res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }
}
const updateStatus = async (req, res, next) => {
    let user = req.body;
    try {
        var query = "update product set status = ? where id = ?";
        const [result] = await db_connection.query(query, [user.status, user.id]);

        if(result.affectedRows === 0) {
            return res.status(404).json({
                message : "product id was not found"
            })
        }

        return res.status(201).json({ message :"product status updated succesfully"})
    }
    catch(error) {
        return res.status(500).json({
            message : "internal server error",
            error : error.message
        })
    }
}


const getProductByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const query = "SELECT * FROM product WHERE categoryId = ?";
        const [results] = await db_connection.query(query,categoryId);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No products found for this category.' });
        }

        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default {addProduct, selectProducts, selectProductById, updateProduct, deleteProduct, updateStatus, getProductByCategory}