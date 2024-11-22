import express from 'express';
import billControllers from '../controllers/billControllers.js';
import auth from '../middleweres/authentication.js';
import role from '../middleweres/checkRole.js';

const billRoute = express.Router();

billRoute.post('/report',auth.authenticateToken, role.checkRole, billControllers.generateReport);
billRoute.post('/getPdf',auth.authenticateToken, billControllers.getPdf);
billRoute.get('/getBills',auth.authenticateToken, billControllers.getBills);
billRoute.delete('/deleteBill/:id',auth.authenticateToken, role.checkRole,billControllers.deleteBill)


export default billRoute;