 import express from "express";

 import { createOrder, getAllOrders, getMyOrders } from "../controllers/orderController.js";

 import authMiddleware from "../middleware/authMiddleware.js";
 
 import adminMiddleware from "../middleware/adminMiddleware.js";
 
 const router = express.Router();

 router.post(
    "/", 
    authMiddleware,
    createOrder
);

 router.get(
    "/my-orders",
     authMiddleware,
     getMyOrders
    ),

 router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllOrders
 );   


 export default router;