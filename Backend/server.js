import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

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
    "https://slamcorps.vercel.app",
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

// 🔍 MIDDLEWARE DE DEBUG: Log de todas las solicitudes POST a productos
app.use((req, res, next) => {
    if (req.method === "POST" && req.path.includes("products")) {
        console.log("\n🚀 SOLICITUD ENTRANTE:");
        console.log("  Método:", req.method);
        console.log("  Ruta:", req.path);
        console.log("  Headers:", {
            "content-type": req.get("content-type"),
            "authorization": req.get("authorization") ? "✅ Presente" : "❌ Falta"
        });
    }
    next();
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


connectDB();

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
});