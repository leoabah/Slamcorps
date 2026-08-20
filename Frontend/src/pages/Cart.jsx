import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { FaMinus, FaPlus } from "react-icons/fa";
import "@/styles/cart.scss"
import orderApi from "../api/orderApi.js";
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast";

export default function Cart(){

     const navigate = useNavigate();

     const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        totalPrice,
        clearCart
     } = useContext(CartContext);

     const handleCheckout = async ()=>{

       const token = localStorage.getItem("token");

       if(!token){
        toast.error(
            "Debes iniciar sesion para comprar"
        );
        return;
       }

       try{

        const products = cart.map(item =>({
            productId: item._id,
            quantity: item.quantity
        }));
        
        const response =  await orderApi.post (
        "/",
        {
            products,
            total: totalPrice
        },
        {
            headers:{
                Authorization:
                `Bearer ${token}`
            }
        }
       );

       toast.success(
        response.data.message ||
        "Compra realizada correctamente"
       );

       clearCart();

       navigate("/perfil");

    } catch(error) {

        console.error(error);

        toast.error(
            error.response?.data?.message ||
            "Error al finalizar la compra"
        );
    }
};

     return(
        <div className="main-cartshop">
            
            <br />
            <br />

            {cart.length === 0 ? (
                <p style={{"fontSize":"40px",
                           "textAlign":"center"
                           }}> 
                    <strong>
                        <em>carrito esta </em> vacio
                    </strong>
                </p>
            ) : (
                <>
                {cart.map(item => (
                    <div key={item._id}
                    className="cart-item"
                    >
                        <img 
                        src={
                            Array.isArray(item.image)
                            ? import.meta.env.BASE_URL +
                            item.image[0].replace("/","")
                            : import.meta.env.BASE_URL +
                            item.image.replace("/","")
                        }
                        />
                        <h3>{item.title}</h3>

                        <p>
                            X{item.quantity}
                        </p>

                        <p>
                             ${item.price}
                        </p>
                        <div className="quantity-controls">
                            <button onClick={() =>
                                decreaseQuantity(item._id)
                            }className="btn-count"
                            >
                            <FaMinus />
                            </button>
                            <span>
                                {item.quantity}
                            </span>

                            <button
                             onClick={()=> 
                                increaseQuantity(item._id)
                             }className="btn-count"
                            >
                            <FaPlus />
                            </button>
                        </div>
                        <button 
                        onClick={() =>
                            removeFromCart(item._id)
                        } 
                        className="btn-cart"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}

                <h2 style={{background:"white"}}>Total: ${totalPrice}</h2>

                <div
                className="botton-cart"
                >

                <button onClick={clearCart} >
                    Vaciar carrito
                </button>

                <button
                 onClick={handleCheckout}
                 
                >
                    Finalizar Compra
                </button>
                </div>
                </>
            )}
        </div>
     )
}