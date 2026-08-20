import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

 import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
 } from "../controllers/productController.js";

 const  router = express.Router();

 router.get("/", getProducts);

 router.get("/:id", getProductById);

 router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    upload.array("image", 4),
    createProduct
 );

 router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    upload.array("image", 4),
    updateProduct
 )

 router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

 export default router ;