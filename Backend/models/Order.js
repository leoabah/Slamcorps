
import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },

    products:[ 
         {
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },

        quantity:Number
    }
],

total: Number,

status :{
    type: String,
    enum:["Pendiente","Pagado","Cancelado"],
    default:"Pendiente"
},

paymentMethod:{
    type:String,
    default:"pendiente"
}
},
 {
    timestamps: true
});


export default mongoose.model(
    "Order",
    orderSchema
);


