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
  const [bankDetails, setBankDetails] = useState(null);

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

    setLoading(true);

    try {
      // Petición UNIFICADA hacia tu backend (Pasa por tu nuevo controlador bifurcado)
      const response = await orderApi.post("/", {
        products: cart.map(item => ({  
          productId: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          size: item.size || "default"
        })),
        total: totalPrice,
        paymentMethod: paymentMethod // "mercadopago" o "transferencia"
      });

      if (paymentMethod === "mercadopago" && response.data.preferenceId) {
        setPreferenceId(response.data.preferenceId);
        toast.success("Orden creada. Proceda al pago en el botón de Mercado Pago.");
      } 
      else if (paymentMethod === "transferencia") {
        setBankDetails(response.data.bankData);
        toast.success("¡Pedido registrado! Realice la transferencia.");
        clearCart(); // Limpiamos el carrito local ya que la orden quedó en la BD
      } 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <h1 className="checkout-title">Checkout</h1>

        {/* 1. Si el carrito está vacío Y no se generaron datos de transferencia bancaria */}
        {cart.length === 0 && !bankDetails ? (
          <p className="checkout-empty">Tu carrito está vacío.</p>
        ) : bankDetails ? (
          /* 2. Si eligió transferencia bancaria y ya se registró la orden en la BD */
          <div className="bank-transfer-success">
            <h2>🎉 ¡Pedido Recibido!</h2>
            <p>Tu orden ha sido registrada con éxito en estado <strong>Pendiente</strong>.</p>
            <p>Para completar tu compra, realiza la transferencia al siguiente CBU:</p>
            <div className="bank-card">
              <p><strong>Titular:</strong> {bankDetails.titular}</p>
              <p><strong>Banco:</strong> {bankDetails.banco}</p>
              <p><strong>CBU:</strong> {bankDetails.cbu}</p> {/* 🟢 Corregido 'bbu' */}
              <p><strong>Alias:</strong> {bankDetails.alias}</p>
              <p><strong>Monto a transferir:</strong> \${totalPrice}</p>
            </div>
            <p className="bank-note">💡 Envía el comprobante de pago por WhatsApp o Correo. Una vez verificado, aprobaremos tu pedido desde el Dashboard.</p>
            <button className="checkout-button" onClick={() => navigate("/perfil")}>Ver mis pedidos</button>
          </div>
        ) : (
          /* 3. Flujo común del carrito de compras listo para pagar */
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
                    <p className="checkout-price">\${item.price}</p>
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
                    disabled={preferenceId} // Deshabilitado si el botón de MP ya está activo
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
                    disabled={preferenceId} // Deshabilitado si el botón de MP ya está activo
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Transferencia</span>
                </label>
              </div>

              {/* Botón interactivo de Mercado Pago */}
              {paymentMethod === "mercadopago" && preferenceId && (
                <div className="checkout-wallet">
                  <Wallet initialization={{ preferenceId }} onReady={() => clearCart()} />
                </div>
              )}
            </div>

            {/* Ocultamos el resumen si el botón de Mercado Pago ya se generó en pantalla */}
            {!preferenceId && (
              <div className="checkout-summary">
                <h2>Total: \${totalPrice}</h2>
                <button className="checkout-button" onClick={handleCheckout} disabled={loading}>
                  {loading ? "Procesando..." : "Confirmar compra"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;
