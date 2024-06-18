import express from 'express';
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./routes/messageRouter.js";
import dotenv from 'dotenv';
import schemeRouter from './routes/schemeRouter.js';
import cors from "cors";


const app = express();

dotenv.config({path:"./config/config.env"});
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/", (req, res)=>{
  res.send("Hello Backend is working fine. :)")
})
dbConnection();

app.use(express.json());
app.use('/api/schemes', schemeRouter);
app.use('/api/message',messageRouter);


export default app;






