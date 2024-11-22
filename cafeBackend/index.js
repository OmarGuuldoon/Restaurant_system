import ('dotenv/config');
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import billRoutes from './routes/billRoutes.js';
import dashboardRoutes from './routes/dashboard.js';


const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/auth',userRoutes);
app.use('/categories',categoryRoutes);
app.use('/product',productRoutes);
app.use('/bill',billRoutes);
app.use('/dashboard',dashboardRoutes);





export default app;