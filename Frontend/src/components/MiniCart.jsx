import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext} from "@/context/CartContext";
import { getImageUrl } from "@/utils/imageUrl";

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
                        src={getImageUrl(
                            Array.isArray(item.image)
                            ? item.image[0]
                            : item.image
                        )}
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