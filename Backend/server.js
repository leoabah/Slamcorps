import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB} from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js";



dotenv.config();

const app = express();
 const allowedOrigins =[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://leoabah.github.io",
    "https://e-comerce-app-swart.vercel.app",
    "https://e-comerce-8hbbdvt8b-leoabahs-projects.vercel.app" 
 ];

app.get("/ping",(req,res)=>{
    res.status(200).send("pong");
});
app.use(cors({
    origin: function(origin,callback){
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true);
        } else{
            callback(new Error(
                "No permitido por CORS")
            );
        }
    }
}));

app.use(express.json());


connectDB();

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
});