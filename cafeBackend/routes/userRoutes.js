import express, { query } from 'express';
import userControllers from '../controllers/userControllers.js';
import db from '../configuration.js';
import auth from '../middleweres/authentication.js';
import checkRole from '../middleweres/checkRole.js';

const userRoutes = express.Router();

userRoutes.post('/signup', userControllers.userRegistration);
userRoutes.post('/login', userControllers.userLogin);
userRoutes.post('/forgotPassword', userControllers.forgotPassword);
userRoutes.patch('/updateUser', userControllers.updateUser);
userRoutes.get('/checkToken', auth.authenticateToken, userControllers.checkToken);
userRoutes.get('/getUserByRole', auth.authenticateToken, userControllers.getUsersByRole);
userRoutes.post('/changePassword', auth.authenticateToken, userControllers.changePassword);

export default userRoutes;