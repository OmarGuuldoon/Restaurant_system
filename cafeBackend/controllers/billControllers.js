import 'dotenv/config';
import express, { query, Router } from 'express';
import db_connection from '../configuration.js';
import puppeteer from 'puppeteer';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; // Import 'join' from 'path'
import fs from 'fs';
import { v1 as uuidv1 } from 'uuid';
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateReport = async (req, res, next) => {
    const generatedUuid = uuidv1();
    const orderDetails = req.body;

    // Check if productDetails is provided and is a valid JSON string
    let productDetailsReport;
    try {
        productDetailsReport = JSON.parse(orderDetails.productDetails);
    } catch (error) {
        return res.status(400).json({
            message: "Invalid productDetails JSON",
            error: error.message
        });
    }

    // Insert the order details into the database
    const query = "INSERT INTO bill (name, uuid, email, contact, paymentMethod, total, productDetails, createdBy) VALUES (?,?,?,?,?,?,?,?)";
    const [result] = await db_connection.query(query, [
        orderDetails.name,
        generatedUuid,
        orderDetails.email,
        orderDetails.contact,
        orderDetails.paymentMethod,
        orderDetails.totalAmount,
        orderDetails.productDetails,
        orderDetails.createdBy,
        res.locals.email
    ]);

    if (!result || result.affectedRows === 0) {
        return res.status(404).json({
            message: "Failed to save order to database"
        });
    }

    try {
        // Render the EJS template
        const htmlContent = await ejs.renderFile(
            join(__dirname, '..', 'views', 'report.ejs'), // Use join to resolve the path correctly
            {
                productDetails: productDetailsReport,
                name: orderDetails.name,
                email: orderDetails.email,
                contact: orderDetails.contact,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount
            }
        );

        // Generate PDF with Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const pdfPath = `./generated_pdf_${generatedUuid}.pdf`;
        await page.pdf({ path: pdfPath, format: 'A4' });
        await browser.close();

        return res.status(201).json({
            message: "PDF generated successfully",
            uuid: generatedUuid,
            pdfPath: pdfPath
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error generating PDF",
            error: error.message
        });
    }
};

const getPdf = async  (req, res, next ) => {
    let orderDetails = req.body;
    try {
        const pdfPath = './generated_pdf_'+orderDetails.uuid +'.pdf';
        if(fs.existsSync(pdfPath)){
            res.contentType("application/pdf");
            fs.createReadStream(pdfPath).pipe(res);
        }
        else {
            var productDetailsReport = JSON.parse(orderDetails.productDetails);
            const htmlContent = await ejs.renderFile(
                join(__dirname, '..', 'views', 'report.ejs'), // Use join to resolve the path correctly
                {
                    productDetails: productDetailsReport,
                    name: orderDetails.name,
                    email: orderDetails.email,
                    contact: orderDetails.contact,
                    paymentMethod: orderDetails.paymentMethod,
                    totalAmount: orderDetails.totalAmount
                }
            );
    
            // Generate PDF with Puppeteer
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(htmlContent);
            const pdfPath = './generated_pdf_'+orderDetails.uuid +'.pdf';
            await page.pdf({ path: pdfPath, format: 'A4' });
            await browser.close();
    
            return res.contentType("application/pdf"),fs.createReadStream(pdfPath).pipe(res);

        }

    }
    catch (eror) {
        return res.status(500).json({
            message : "INTERNAL SERVER ERROR",
            error : message.error
        })
    }

} 
const getBills = async (req, res , next) => {
    try {
        var query = "select * from bill order by id DESC";
        const [result] = await db_connection.query(query);
        if(result.length === 0) {
            return res.status(500).json({
                message : "no bills were found"
            })
        }
        return res.status(201).json({
            result
        })
    }
    catch(error){
        return res.status(500).json({
            message : "INTERNAL SERVER ERROR"
        })
    }
}
const deleteBill = async (req, res, next) => {
    const id = req.params.id;
    try {
        var query = "delete from bill where id =?";
        const [result] = await db_connection.query(query,[id]);
        if(result.affectedRows === 0) {
            return res.status(404).json({
                message : "no bill with that id was found"
            })
        }
        return res.status(201).json({
            result
        })
    }
    catch(error) {
        return res.status(500).json({
            message : "INVALID ERROR"
        })
    }
}

export default { generateReport, getPdf ,getBills,deleteBill};
