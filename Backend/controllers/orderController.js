
import { Preference, Payment } from "mercadopago";
import Order from "../models/Order.js";
import client from "../config/mp.js"; 

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

        // Formateamos los productos para la base de datos de manera segura usando 'p'
        const formattedProducts = products.map((p) => ({
            productId: p.productId || p._id,
            size: p.size || "default",
            quantity: Number(p.quantity || 1)
        }));
       
        // Guardamos el registro inicial en MongoDB en estado Pendiente
        const order = await Order.create({
            user: req.user.id,
            products: formattedProducts,
            total: Number(total),
            paymentMethod: paymentMethod || "mercadopago",
            status: "Pendiente"
        });

        console.log("✅ ORDEN CREADA EN MONGO CON ID:", order._id);

        // CONDICIÓN A: CLIENTE ELIGIÓ MERCADO PAGO
        if (paymentMethod === "mercadopago") {
            const preference = new Preference(client);

            const data = await preference.create({
                body: {
                    items: products.map((p) => ({
                        title: p.title || p.name || "Producto de Librería Cósmica",
                        quantity: Number(p.quantity || 1),
                        unit_price: Number(p.price || 0),
                        currency_id: "ARS"
                    })),
                    metadata: {
                        total: total,
                        order_id: order._id.toString() // Guardamos el ID de la orden aquí adentro
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
        
        // CONDICIÓN B: CLIENTE ELIGIÓ TRANSFERENCIA BANCARIA
        else if (paymentMethod === "transferencia") {
            return res.status(201).json({
                message: "Orden registrada correctamente bajo transferencia bancaria.",
                order,
                bankData: {
                    banco: "Banco Galicia",
                    cbu: "0070123420000012345678",
                    alias: "libreria.cosmica.mp",
                    titular: "Libreria Cosmica S.R.L."
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

// Agrega esto al final de backend/controllers/orderController.js
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validamos estrictamente según los estados que soporta el Schema de tu Base de Datos
        if (!["Pendiente", "Pagado", "Cancelado"].includes(status)) {
            return res.status(400).json({ message: "Estado de orden no válido" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "No se encontró el pedido solicitado" });
        }

        return res.status(200).json({ message: "Pedido actualizado correctamente", order: updatedOrder });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
