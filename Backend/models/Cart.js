
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
       products:[
        {
            productId: String,
            title: String,
            image: String,
            price: Number,
            quantity: Number
        }
       ],
       total: Number
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Cart",cartSchema);