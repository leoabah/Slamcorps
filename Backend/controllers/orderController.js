import { Preference, Payment } from "mercadopago";
import Order from "../models/Order.js";
import Product from "../models/Product.js"; // 🟢 Importación indispensable para modificar las existencias
import client from "../config/mp.js"; 

// 🔍 FUNCIÓN AUXILIAR REUTILIZABLE: Descuenta el stock de los productos comprados por talle
const descontarStockDeOrden = async (orderId) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) return;

        // Evitamos descontar stock dos veces si la orden ya había sido pagada/aprobada
        if (order.status === "Pagado") return;

        console.log(`📉 Iniciando descuento de stock para la orden: ${orderId}`);

        for (const item of order.products) {
            const product = await Product.findById(item.productId);
            
            if (product) {
                const talleComprado = item.size || "default";
                const cantidadComprada = Number(item.quantity || 1);

                // Verificamos si el producto maneja stock estructurado por talle
                if (product.stock && product.stock[talleComprado] !== undefined) {
                    const stockActual = Number(product.stock[talleComprado] || 0);
                    
                    // Restamos las unidades asegurando que el límite mínimo sea 0
                    product.stock[talleComprado] = Math.max(0, stockActual - cantidadComprada);
                    
                    // Guardamos el cambio en MongoDB
                    await product.save();
                    console.log(`✅ Stock actualizado para ${product.title} (Talle: ${talleComprado}): ${stockActual} -> ${product.stock[talleComprado]}`);
                }
            }
        }
    } catch (error) {
        console.error("❌ Error crítico al descontar stock de la orden:", error);
    }
};

// 🚀 1. WEBHOOK: Procesa la respuesta automática de Mercado Pago
export const receiveWebhook = async (req, res) => {
    try {
        const { query } = req;

        if (query.type === "payment") {
            const paymentId = query["data.id"];

            const payment = new Payment(client);
            const paymentData = await payment.get({ id: paymentId });

            console.log("Estado de MP para el pago:", paymentData.status);

            if (paymentData.status === "approved") {
                const orderId = paymentData.metadata?.order_id;

                if (orderId) {
                    // 🟢 Aplicamos descuento de stock antes de marcar la orden como Pagada
                    await descontarStockDeOrden(orderId);

                    await Order.findByIdAndUpdate(
                        orderId,
                        {
                            status: "Pagado",
                            paymentMethod: "mercadopago"
                        }
                    );
                    console.log(`✅ Orden ${orderId} actualizada a estado Pagado via Webhook`);
                }
            }
        }

        return res.status(200).send("Webhook recibido correctamente");
    } catch (error) {
        console.error("Error al procesar el webhook:", error);
        return res.status(500).json({ error: error.message });
    }
};

// 🚀 2. CREATE ORDER: Flujo unificado con bifurcación Mercado Pago / Transferencia
export const createOrder = async (req, res) => {
    try {
        const { products, total, paymentMethod } = req.body;
        
        if (!products || products.length === 0){
            return res.status(400).json({ message: "El carrito está vacío" });
        }

        const formattedProducts = products.map((p) => ({
            productId: p.productId || p._id,
            size: p.size || "default",
            quantity: Number(p.quantity || 1)
        }));
       
        const order = await Order.create({
            user: req.user.id,
            products: formattedProducts,
            total: Number(total),
            paymentMethod: paymentMethod || "mercadopago",
            status: "Pendiente"
        });

        console.log("✅ ORDEN CREADA EN MONGO CON ID:", order._id);

        if (paymentMethod === "mercadopago") {
            const preference = new Preference(client);

            const data = await preference.create({
                body: {
                    items: products.map((p) => ({
                        title: p.title || p.name || "Producto Slam Corps",
                        quantity: Number(p.quantity || 1),
                        unit_price: Number(p.price || 0),
                        currency_id: "ARS"
                    })),
                    metadata: {
                        total: total,
                        order_id: order._id.toString()
                    },
                    notification_url: "https://onrender.com",
                    back_urls: {
                        success: "https://onrender.com",
                        failure: "https://onrender.com",
                        pending: "https://onrender.com"
                    },
                    auto_return: "approved"
                }
            });

            return res.status(201).json({
                message: "Orden creada. Inicializando Mercado Pago...",
                order,
                preferenceId: data.id
            });
        } 
        else if (paymentMethod === "transferencia") {
            return res.status(201).json({
                message: "Orden registrada correctamente bajo transferencia bancaria.",
                order,
                bankData: {
                    banco: "Banco Provincia",
                    cbu: "0140004503400451984457",
                    alias: "rociodeminkoe.junior",
                    titular: "Serge Lazare Minkoe Minkoe"
                }
            });
        }

    } catch (error) {
        console.error("Error crítico en createOrder:", error);
        return res.status(500).json({ message: error.message });
    }
};

// 🚀 3. GET MY ORDERS: Consulta las órdenes del usuario autenticado
export const getMyOrders = async (req, res) => {
    try {
        const order = await Order.find({ user: req.user.id }).populate("products.productId");
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🚀 4. GET ALL ORDERS: Consulta todas las órdenes de la tienda para el Administrador
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products.productId");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🚀 5. UPDATE ORDER STATUS: Modificación manual desde el Dashboard de administración
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["Pendiente", "Pagado", "Cancelado"].includes(status)) {
            return res.status(400).json({ message: "Estado de orden no válido" });
        }

        // 🟢 Si el administrador aprueba manualmente la transferencia, descontamos stock primero
        if (status === "Pagado") {
            await descontarStockDeOrden(id);
        }

        // Corrección del warning de Mongoose usando 'returnDocument'
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: 'after' }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "No se encontró el pedido solicitado" });
        }

        return res.status(200).json({ message: "Pedido actualizado correctamente", order: updatedOrder });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
