import Cart from '../models/Cart.js';

export const saveCart = async (req , res ) => {

    console.log(

        "Pedido recibido:");

        console.log(req.body);

        const order = 
        await Cart.create(req.body);

        res.satus(201).json
({
    message:" Pedido gardado",
    order
});

;}