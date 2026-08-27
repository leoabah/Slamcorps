import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

// 🔍 FUNCIÓN AUXILIAR: Borra archivos locales de forma segura
const deleteLocalFiles = (imagePaths) => {
    if (!imagePaths || !Array.isArray(imagePaths)) return;
    
    imagePaths.forEach(imagePath => {
        // Solo intentamos borrar si la ruta apunta a nuestra carpeta local /uploads
        if (imagePath.startsWith("/uploads/")) {
            // Convertimos la ruta relativa en una ruta absoluta del servidor
            const absolutePath = path.join(process.cwd(), imagePath);
            
            // Verificamos si el archivo realmente existe en el disco antes de borrarlo
            if (fs.existsSync(absolutePath)) {
                fs.unlink(absolutePath, (err) => {
                    if (err) console.error(`Error al borrar el archivo ${absolutePath}:`, err);
                });
            }
        }
    });
};

// 🟢 OBTENER TODOS LOS PRODUCTOS
export const getProducts = async (req , res) => {
    try {
        const products = await Product.find();
        return res.json(products);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
};

// 🟡 OBTENER UN PRODUCTO POR ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        return res.json(product);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
};

// 🔵 CREAR PRODUCTO (Tu lógica híbrida perfecta)
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, stock, imageURLs } = req.body;
        
        let finalImages = [];
        if (req.files && req.files.length > 0) {
            finalImages = req.files.map(file => `/uploads/${file.filename}`);
        } 
        else if (imageURLs) {
            finalImages = Array.isArray(imageURLs) ? imageURLs : [imageURLs];
        }

        const newProduct = new Product({
            title,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
            image: finalImages 
        });

        const savedProduct = await newProduct.save();
        return res.status(201).json({ message: "Producto creado con éxito!", product: savedProduct });

    } catch (error) {
        return res.status(500).json({ message: "Error al guardar el producto", error: error.message });
    }
};

// 🟠 ACTUALIZAR PRODUCTO (Corregido para recibir nuevas fotos)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category, stock, imageURLs } = req.body;

        // Buscamos el producto actual para saber qué imágenes tenía antes
        const currentProduct = await Product.findById(id);
        if (!currentProduct) return res.status(404).json({ message: "Producto no encontrado" });

        // Preparamos los datos básicos a actualizar
        let updateData = { 
            title, 
            description, 
            category,
            price: price ? Number(price) : undefined,
            stock: stock ? Number(stock) : undefined
        };

        // Procesamos las imágenes si se enviaron cambios
        let newImages = [];
        let hasNewImages = false;

        if (req.files && req.files.length > 0) {
            newImages = req.files.map(file => `/uploads/${file.filename}`);
            hasNewImages = true;
        } else if (imageURLs) {
            newImages = Array.isArray(imageURLs) ? imageURLs : [imageURLs];
            hasNewImages = true;
        }

        if (hasNewImages) {
            // Si el producto viejo tenía fotos locales en /uploads, las borramos del disco duro
            deleteLocalFiles(currentProduct.image);
            // Agregamos las nuevas rutas al objeto de actualización
            updateData.image = newImages;
        }

        // Ejecutamos la actualización en MongoDB
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        
        return res.json({ message: "Producto actualizado con éxito", product: updatedProduct });

    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
    }
};

// 🔴 ELIMINAR PRODUCTO (Corregido para limpiar el disco duro)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscamos el producto antes de borrarlo para inspeccionar sus imágenes
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });

        // Borramos del almacenamiento físico cualquier foto que pertenezca a este producto
        deleteLocalFiles(product.image);

        // Ahora sí, eliminamos el registro de la base de datos
        await Product.findByIdAndDelete(id);

        return res.json({ message: "Producto e imágenes eliminados correctamente" });

    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
};
