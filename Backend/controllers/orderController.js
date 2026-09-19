
import { MercadoPagoConfig, Preference } from "mercadopago";
import Order from "../models/Order.js"

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

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
          total
        },
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