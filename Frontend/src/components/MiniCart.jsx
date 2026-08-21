import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext} from "@/context/CartContext";

export default function MiniCart() {

    const {
        cart,
        totalPrice
    } = useContext(CartContext);

    return(

        <div className="mini-cart">

            {cart.length === 0 ? (
                <p className="empty-cart">
                    Esta vacio
                </p>

            ) : (
                <>
                  {cart.map(item => (
                    <div
                      key={`${item._id || item.id}-${item.size}`}
                      className="mini-cart-item"
                      >
                        <img 
                        src={!item.image
                            ? "/placeholder.jpg"
                            :Array.isArray(item.image)
                            ? import.meta.env.BASE_URL +
                            item.image[0].replace("/","")
                            : import.meta.env.BASE_URL +
                            item.image.replace("/","")
                        
                        }
                        alt={item.title || 
                            "producto"
                        }
                />

                       <div className="mini-cart-info">

                        <h4>
                            {item.name || item.title}
                        </h4>
                        {item.size && (
                            <p className="item-size-badge">
                                Talle:<strong>{item.size}</strong> 
                            </p>
                        )}
                        <p>
                            {item.quantity}
                          X {item.price}
                        </p>
                          
                       </div>
                   </div>
                  ))}
                  <div className="mini-cart-total">

                    <h3>
                        Total:
                        $ {totalPrice}
                    </h3>

                  </div>
                  <Link
                    to="/cart"
                    className="mini-cart-btn"

                    >
                        Ver Carrito
                  </Link>

                </>
            )
        }

        </div>
    );
}