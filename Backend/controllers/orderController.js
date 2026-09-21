
import { Preference } from "mercadopago";
import Order from "../models/Order.js";
// Importa el cliente de MercadoPago desde el archivo de configuración
import client from "../config/mp.js";

export const receiveWebhook = async (req, res) => {
    try {
        const { query } = req;

        // verificamos que la notificación de pago (payment)
        if (query.type === "payment") {
            const paymentId = query["data.id"];

            // consulta de estado de pago a la API de MercadoPago
            const payment = new Payment(client);
            const paymentData = await payment.get({ id: paymentId });

            // Debería dar "approved"
            console.log("Estado de MP para el pago:", paymentData.status);

            if (paymentData.status === "approved") {
                // Buscamos la orden asociada (puedes relacionarla usando metadata en la preferencia)
                const orderId = paymentData.metadata?.order_id;

                if (orderId) {
                    await Order.findByIdAndUpdate(
                        orderId,
                        {
                            status: "aprobado",
                            paymentMethod: "pago con MercadoPago"
                        }
                    );

                    console.log(`✅ Orden ${orderId} actualizada a estado aprobado`);
                }
            }
        }

        // Siempre respondemos con 200 OK a MercadoPago para que no reintente enviar la notificación
        return res.status(200).send("Webhook recibido correctamente");
    } catch (error) {
        console.error("Error al procesar el webhook:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const createOrder = async (
    req,
    res
) => {
    console.log("BODY", req.body);
    try{
        const formattedProducts = req.body.products.map((product) => ({
            productId: product.productId || product._id ,
            size: product.size,
            quantity: product.quantity
        }));
       
        console.log("ORDEN CREADA:", formattedProducts, order);

        const order = await Order.create({
            user: req.user.id,
            products: formattedProducts,
            total: req.body.total,
            paymentMethod: req.body.paymentMethod || "mercadopago"
        });
        console.log("ORDER CREADA:", order);

        res.status(201).json({
            message:
            "orden creada correctamente",
            order
        });
    } catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

export const getMyOrders = async (
    req,
    res
) => {
    try {
        const order = await Order.find({
            user:req.user.id
        })
        .populate(
           "products.productId"
        );
        res.json(order);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

export const getAllOrders = async(
    req,res
)=>{
    try{
         const orders =
         await Order.find()
            .populate(
                "user",
                "name email"
            )
            .populate(
                "products.productId"
            );
            res.json(orders);
         
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

 export const createMercadoPagoPreference = async (req, res) => {
  try {
    const { products, total } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    const preference = new Preference(client);

    const data = await preference.create({
      body: {
        items: products.map((product) => ({
          title: product.title || product.name || "Producto",
          quantity: Number(product.quantity || 1),
          unit_price: Number(product.price || product.unit_price || 0)
        })),
        metadata: {
          total,
          order_id: req.body.orderId || null
        },
        notification_url: "https://slamcorps.onrender.com/webhook",
        back_urls: {
          success: "https://slamcorps.onrender.com/perfil",
          failure: "https://slamcorps.onrender.com/checkout",
          pending: "https://slamcorps.onrender.com/checkout"
        }
      }
    });

    return res.status(200).json({
      preferenceId: data.id
    });
  } catch (error) {
    console.error(error);
    console.error("ERROR DETALLADO DE MERCADOPAGO:", error.cause || error);
    return res.status(500).json({
      message: error.message || "Error al crear la preferencia"
    });
  }
};