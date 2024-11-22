import ('dotenv/config');
import http from "http";
import app from './index.js';
import db_connection from "./configuration.js";


const server = http.createServer(app);
server.listen(process.env.PORT, ()=> {
    console.log("server started at port " + process.env.PORT)
});