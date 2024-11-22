import express from 'express';
import productControllers from '../controllers/productControllers.js';
import auth from '../middleweres/authentication.js';
import role from '../middleweres/checkRole.js';

const productRoute = express.Router();

productRoute.post('/add', auth.authenticateToken, role.checkRole,productControllers.addProduct);
productRoute.get('/get',auth.authenticateToken, role.checkRole, productControllers.selectProducts);
productRoute.get('/getById/:id',auth.authenticateToken, role.checkRole, productControllers.selectProductById);
productRoute.patch('/updateProduct', auth.authenticateToken, role.checkRole, productControllers.updateProduct);
productRoute.delete('/delete/:id', auth.authenticateToken, role.checkRole, productControllers.deleteProduct);
productRoute.patch('/updateStatus', auth.authenticateToken, role.checkRole, productControllers.updateStatus);
export default productRoute