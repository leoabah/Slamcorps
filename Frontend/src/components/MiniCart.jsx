import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext} from "@/context/CartContext";

export default function MiniCart({setOpenCart}) {

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
                      key={item._id}
                      className="mini-cart-item"
                      >
                        <img 
                        src={
                            Array.isArray(item.image)
                            ? import.meta.env.BASE_URL +
                            item.image[0].replace("/","")
                            : import.meta.env.BASE_URL +
                            item.image.replace("/","")
                        
                        }
                        alt={item.name}
                />

                       <div className="mini-cart-info">

                        <h4>
                            {item.name}
                        </h4>
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