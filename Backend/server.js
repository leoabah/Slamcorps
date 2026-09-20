import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import contactRoutes from "./routes/contactsRoutes.js";
import { connectDB} from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js";
import { MercadoPagoConfig, Preference } from "mercadopago";


dotenv.config();

const app = express();

app.use(express.json());

 const allowedOrigins =[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://leoabah.github.io",
    "https://slamcorps.vercel.app",
    ];
    
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

 // Rutas de uptimer para mantener el servidor activo en plataformas como Render
app.get("/ping",(req,res)=>{
    res.status(200).send("pong");
});
app.all("/", (req, res) => {
    res.status(200).send("SlamCorps API is running perfectly!");
});



// Intergracion de MercadoPago
// const client = new MercadoPagoConfig({
//     accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
// });


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

app.use("/api/contacts", contactRoutes);
app.get("/api/contacts", contactRoutes);
app.post("/api/contacts", contactRoutes);
app.patch("/api/contacts/:id/read", contactRoutes);

connectDB();

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
});