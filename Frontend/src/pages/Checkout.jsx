
import { Wallet } from "@mercadopago/sdk-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CartContext } from "../context/cartContext.js";
import orderApi from "../api/orderApi.js";
import "@/styles/checkout.scss";

function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("mercadopago");
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Debes iniciar sesión para comprar");
      navigate("/login");
      return;
    }

    if (paymentMethod === "mercadopago") {
      setLoading(true);

      try {
        const response = await orderApi.post(
          "/create-preference",
          {
            products: cart.map(item => ({
              productId: item._id,
              title: item.title,
              quantity: item.quantity,
              price: item.price,
              size: item.size || "default"
            })),
            total: totalPrice
          }
        );

        setPreferenceId(response.data.preferenceId);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error al crear la preferencia de pago");
      } finally {
        setLoading(false);
      }

      return;
    }

    try {
      const products = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        size: item.size || "default"
      }));

      const response = await orderApi.post(
        "/",
        {
          products,
          total: totalPrice,
          paymentMethod
        }
      );

      toast.success(response.data.message || "Compra realizada correctamente");
      clearCart();
      navigate("/perfil");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al finalizar la compra");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <h1 className="checkout-title">Checkout</h1>

        {cart.length === 0 ? (
          <p className="checkout-empty">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="checkout-products">
              {cart.map(item => (
                <div key={`${item._id}-${item.size || "default"}`} className="checkout-item">
                  <div className="checkout-image">
                    <img src={
                      Array.isArray(item.image)
                        ? import.meta.env.BASE_URL + item.image[0].replace("/", "")
                        : import.meta.env.BASE_URL + item.image.replace("/", "")
                    } alt={item.title} />
                  </div>
                  <div className="checkout-details">
                    <div className="checkout-detail-text">
                      <h5 className="checkout-detail">{item.title}</h5>
                      {item.size && <p className="checkout-size">Talle: {item.size}</p>}
                    </div>
                    <p className="checkout-quantity">X{item.quantity}</p>
                    <p className="checkout-price">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-payment">
              <h3>Método de pago</h3>
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mercadopago"
                    checked={paymentMethod === "mercadopago"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="mercadopago">Mercado Pago</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transferencia"
                    checked={paymentMethod === "transferencia"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Transferencia</span>
                </label>
              </div>

              {paymentMethod === "mercadopago" && preferenceId && (
                <div className="checkout-wallet">
                  <Wallet initialization={{ preferenceId }} />
                </div>
              )}
            </div>

            <div className="checkout-summary">
              <h2>Total: ${totalPrice}</h2>
              <button className="checkout-button" onClick={handleCheckout} disabled={loading}>
                {loading ? "Procesando..." : "Confirmar compra"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout