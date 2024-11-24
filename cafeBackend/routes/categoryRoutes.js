import express from 'express';
import categoryControllers from '../controllers/categoryController.js';
import auth from '../middleweres/authentication.js';
import checkRole from '../middleweres/checkRole.js';

const categoryRoutes = express.Router();

categoryRoutes.post('/addCategory',auth.authenticateToken,checkRole.checkRole, categoryControllers.addCategory);
categoryRoutes.get('/categories', auth.authenticateToken,categoryControllers.selectCategories);
categoryRoutes.patch('/updateCategory', auth.authenticateToken, checkRole.checkRole,categoryControllers.updateCategory);
categoryRoutes.delete('/deleteCategory/:id', auth.authenticateToken, checkRole.checkRole,categoryControllers.deleteCategory);

export default categoryRoutes