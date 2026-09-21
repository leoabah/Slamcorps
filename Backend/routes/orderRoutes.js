import express from "express";
import { 
    createOrder, 
    getAllOrders, 
    getMyOrders,
    receiveWebhook,
    updateOrderStatus
} from "../controllers/orderController.js";

// Mantenemos tus middlewares originales con sus nombres exactos
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
 
const router = express.Router();

// 🚀 1. WEBHOOK: Mercado Pago le pega a esta ruta de forma automática
router.post("/webhook", receiveWebhook);

// 🚀 2. CREAR ORDEN: Crea en Mongo y bifurca (MP o Transferencia)
router.post("/", authMiddleware, createOrder);

// 🚀 3. VER MIS PEDIDOS: Para el perfil del cliente
router.get("/my-orders", authMiddleware, getMyOrders);

// 🚀 4. VER TODOS LOS PEDIDOS: Exclusivo para el Dashboard del Administrador
router.get("/", authMiddleware, adminMiddleware, getAllOrders);

// 🚀 5. ACTUALIZAR ESTADO DE ORDEN: Solo accesible para el Administrador autenticado
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
