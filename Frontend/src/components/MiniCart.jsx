import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "@/context/cartContext.js";

export default function MiniCart({ setOpenCart }) {
  const {
    cart,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  return (
    <div className="mini-cart-overlay">
      <div className="mini-cart-backdrop" onClick={() => setOpenCart?.(false)} />

      <div className="mini-cart">
        <button
          className="mini-cart-close"
          aria-label="Cerrar mini carrito"
          onClick={() => setOpenCart?.(false)}
        >
          ×
        </button>

        {cart.length === 0 ? (
          <div className="empty-cart-wrap">
            <p className="empty-cart">Está vacío</p>
            <button
              className="mini-cart-close-empty"
              onClick={() => setOpenCart?.(false)}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item._id} className="mini-cart-item">
                <img
                  src={
                    Array.isArray(item.image)
                      ? import.meta.env.BASE_URL + item.image[0].replace("/", "")
                      : import.meta.env.BASE_URL + item.image.replace("/", "")
                  }
                  alt={item.name || item.title}
                />

                <div className="mini-cart-info">
                  <h4>{item.name || item.title}</h4>
                  <p>
                    {item.quantity} x ${Number(item.price).toFixed(2)}
                  </p>

                  <div className="mini-cart-actions">
                    <button onClick={() => decreaseQuantity(item._id)}>-</button>
                    <button onClick={() => increaseQuantity(item._id)}>+</button>
                    <button onClick={() => removeFromCart(item._id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mini-cart-total">
              <h3>Total: $ {Number(totalPrice).toFixed(2)}</h3>
            </div>

            <div className="mini-cart-actions-row">
              <Link
                to="/cart"
                className="mini-cart-btn"
                onClick={() => setOpenCart?.(false)}
              >
                Ver Carrito
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}