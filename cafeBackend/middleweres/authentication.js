import dotenv from 'dotenv/config';
import jwt from 'jsonwebtoken';


function authenticateToken(req, res, next) {
    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }


        const user =  jwt.verify(token, process.env.JWT_SECRET);
        res.locals.user = user;
        console.log("Decoded : ", user);

        next();
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
}

export  default  { authenticateToken };

