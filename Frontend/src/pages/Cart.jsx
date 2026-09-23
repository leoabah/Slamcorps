import { useContext } from "react"
import { CartContext } from "../context/cartContext.js"
import { FaMinus, FaPlus } from "react-icons/fa";
import "@/styles/cart.scss"
import { useNavigate } from "react-router-dom"
import { getImageUrl } from "../utils/imageUrl";

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

     return(
        <div className="main-cartshop">
            <br />
            <br />

            {cart.length === 0 ? (
                <p style={{"fontSize":"40px", "textAlign":"center"}}> 
                    <strong>
                        <em>tu carrito está </em> vacío
                    </strong>
                </p>
            ) : (
                <>
                {cart.map(item => (
                    // 🟢 CLAVE: La key ahora incluye el talle para renderizar variantes independientes de forma correcta
                    <div key={`${item._id}-${item.size || "default"}`} className="cart-item">
                        <img 
                            src={getImageUrl(
                                Array.isArray(item.image) ? item.image[0] : item.image
                            )}
                            alt={item.title}
                        />
                        <h3>{item.title}</h3>
                        {item.size && (
                            <p className="item-size-badge">
                                Talle: <strong>{item.size}</strong> 
                            </p>
                        )}

                        <p>X{item.quantity}</p>
                        <p>\${item.price}</p>
                        
                        <div className="quantity-controls">
                            {/* 🟢 CORRECCIÓN: Se pasa el id y el talle para disminuir de forma selectiva */}
                            <button 
                                onClick={() => decreaseQuantity(item._id, item.size)} 
                                className="btn-count"
                            >
                                <FaMinus />
                            </button>
                            
                            <span>{item.quantity}</span>

                            {/* 🟢 CORRECCIÓN: Se pasa el id y el talle para aumentar respetando el tope de stock máximo */}
                            <button 
                                onClick={() => increaseQuantity(item._id, item.size)} 
                                className="btn-count"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        
                        {/* 🟢 CORRECCIÓN: Se pasa el id y el talle para remover únicamente la variante correcta */}
                        <button 
                            onClick={() => removeFromCart(item._id, item.size)} 
                            className="btn-cart"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}

                <h2 style={{background:"white"}}>Total: \${totalPrice}</h2>

                <div className="botton-cart">
                    <button onClick={clearCart}>
                        Vaciar carrito
                    </button>

                    <button onClick={() => navigate("/checkout")}>
                        Finalizar Compra
                    </button>
                </div>
                </>
            )}
        </div>
     );
}
