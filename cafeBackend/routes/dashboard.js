import express from 'express';
import dashboardController from '../controllers/dashboardControllers.js';
import auth from '../middleweres/authentication.js';
import role from '../middleweres/checkRole.js';

const dashboardRoutes = express.Router();
dashboardRoutes.get('/details',auth.authenticateToken,dashboardController.getDetails);

export default dashboardRoutes;