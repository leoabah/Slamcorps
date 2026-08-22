
import Order from "../models/Order.js"

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

        const order =
        await Order.create({
            user:req.user.id,
            products:formattedProducts,
            total: req.body.total
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