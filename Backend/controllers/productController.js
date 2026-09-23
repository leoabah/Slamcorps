import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (file) => new Promise((resolve, reject) => {
    console.log("🔄 Iniciando upload a Cloudinary para archivo:", file.originalname);
    
    const stream = cloudinary.uploader.upload_stream(
        { folder: "slamcorps/products", resource_type: "image" },
        (error, result) => {
            if (error) {
                console.error("❌ Error en upload_stream:", error);
                reject(new Error(`Cloudinary error: ${error.message}`));
            } else {
                console.log("✅ Response COMPLETO de Cloudinary:", JSON.stringify(result, null, 2));
                console.log("📸 secure_url extraída:", result.secure_url);
                console.log("📸 URL type:", typeof result.secure_url);
                console.log("📸 URL length:", result.secure_url?.length);
                resolve(result.secure_url);
            }
        }
    );

    stream.on('error', (err) => {
        console.error("❌ Error en el stream:", err);
        reject(err);
    });

    stream.end(file.buffer);
});

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

// 🟢 REEMPLAZA ÚNICAMENTE TU FUNCIÓN createProduct POR ESTA EN EL BACKEND:
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, stock, imageURLs } = req.body;
        
        console.log("📤 Recibido en createProduct:", { title, category, filesCount: req.files?.length, hasImageURLs: !!imageURLs });
        
        // 🛠️ CORRECCIÓN 1: Procesamiento seguro del Stock por Talle (Clonado de tu lógica de updateProduct)
        let parsedStock = { S: 0, M: 0, L: 0, XL: 0 }; // Valores por defecto por seguridad
        if (stock) {
            if (typeof stock === 'string') {
                try {
                    parsedStock = JSON.parse(stock);
                } catch (e) {
                    console.error("❌ Error al parsear stock string en backend:", e);
                }
            } else if (typeof stock === 'object') {
                parsedStock = stock;
            }
        }
        
        let finalImages = [];
        if (req.files && req.files.length > 0) {
            console.log("📸 Subiendo archivos a Cloudinary...", req.files.length);
            finalImages = await Promise.all(req.files.map(uploadToCloudinary));
            console.log("✅ URLs de Cloudinary recibidas:", finalImages);
        } 
        else if (imageURLs) {
            console.log("🔗 Usando URLs proporcionadas:", imageURLs);
            // Si viene de una URL de texto plano en JSON, nos aseguramos de que sea un Array
            finalImages = Array.isArray(imageURLs) ? imageURLs : [imageURLs];
        } else {
            console.warn("⚠️ No se encontraron imágenes");
        }

        // 🛠️ CORRECCIÓN 2: Guardamos 'parsedStock' como el objeto que MongoDB espera recibir
        const newProduct = new Product({
            title,
            description,
            price: Number(price),
            category,
            stock: parsedStock, // 👈 Guardamos el objeto completo {S, M, L, XL} con sus cantidades
            image: finalImages 
        });

        const savedProduct = await newProduct.save();
        console.log("💾 Producto guardado con éxito:", savedProduct._id);
        return res.status(201).json({ message: "Producto creado con éxito!", product: savedProduct });

    } catch (error) {
        console.error("❌ Error en createProduct:", error);
        return res.status(500).json({ 
            message: "Error al guardar el producto", 
            error: error.message,
            details: error.stack 
        });
    }
};

// 🟠 ACTUALIZAR PRODUCTO (Corregido para guardar Stock siempre)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category, stock, imageURLs } = req.body;

        // 1. Buscamos el producto actual en la base de datos
        const currentProduct = await Product.findById(id);
        if (!currentProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // 2. Procesamiento seguro del Stock por Talle
        let parsedStock;
        if (stock) {
            if (typeof stock === 'string') {
                try {
                    parsedStock = JSON.parse(stock);
                } catch (e) {
                    console.error("Error al parsear stock string en backend:", e);
                }
            } else if (typeof stock === 'object') {
                parsedStock = stock;
            }
        }

        // 3. Preparamos el objeto con los datos que se actualizarán SÍ O SÍ
        let updateData = { 
            title: title || currentProduct.title, 
            description: description || currentProduct.description, 
            category: category || currentProduct.category,
            price: price ? Number(price) : currentProduct.price,
            stock: parsedStock || currentProduct.stock // 👈 Garantiza que el stock se asigne siempre
        };

        // 4. Procesamiento condicional de imágenes
        let newImages = [];
        let hasNewImages = false;

        if (req.files && req.files.length > 0) {
            console.log("📸 Procesando nuevas imágenes subidas...");
            newImages = await Promise.all(req.files.map(uploadToCloudinary));
            hasNewImages = true;
        } else if (imageURLs) {
            console.log("🔗 Procesando nuevas URLs de imágenes...");
            newImages = Array.isArray(imageURLs) ? imageURLs : [imageURLs];
            hasNewImages = true;
        }

        // Si el usuario envió imágenes nuevas (por archivo o URL), reemplazamos las anteriores
        if (hasNewImages) {
            deleteLocalFiles(currentProduct.image);
            updateData.image = newImages;
        } else {
            // 🟢 CLAVE: Si no envió imágenes, conservamos intactas las que ya tenía el producto
            updateData.image = currentProduct.image;
        }

        // 5. Ejecutamos la actualización física en MongoDB con el estándar moderno
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            updateData, 
            { returnDocument: 'after' }
        );
        
        console.log("✅ Producto actualizado con éxito en la base de datos.");
        return res.json({ message: "Producto actualizado con éxito", product: updatedProduct });

    } catch (error) {
        console.error("❌ Error en updateProduct del backend:", error);
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
