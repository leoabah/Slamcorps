import { Wallet } from "@mercadopago/sdk-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CartContext } from "../context/cartContext.js";
import orderApi from "../api/orderApi.js";
import "@/styles/checkout.scss";

function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("mercadopago");
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);

  const handleCheckout = async () => {
    if (cart.length === 0 && !preferenceId) { // 🟢 Ajustado por seguridad
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
      const response = await orderApi.post("/", {
        products: cart.map(item => ({  
          productId: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          size: item.size || "default"
        })),
        total: totalPrice,
        paymentMethod: paymentMethod 
      });

      if (paymentMethod === "mercadopago" && response.data.preferenceId) {
        setPreferenceId(response.data.preferenceId);
        toast.success("Orden creada. Proceda al pago en el botón de Mercado Pago.");
      } 
      else if (paymentMethod === "transferencia") {
        setBankDetails(response.data.bankData);
        toast.success("¡Pedido registrado! Realice la transferencia.");
        //clearCart(); 
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

        {/* 🟢 CORRECCIÓN CRÍTICA: Solo muestra vacío si no hay un id de Mercado Pago procesándose */}
        {cart.length === 0 && !bankDetails && !preferenceId ? (
          <p className="checkout-empty">Tu carrito está vacío.</p>
        ) : bankDetails ? (
          <div className="bank-transfer-success">
            <h2>🎉 ¡Pedido Recibido!</h2>
            <p>Tu orden ha sido registrada con éxito en estado <strong>Pendiente</strong>.</p>
            <p>Para completar tu compra, realiza la transferencia al siguiente CBU:</p>
            <div className="bank-card">
              <p><strong>Titular:</strong> {bankDetails.titular}</p>
              <p><strong>Banco:</strong> {bankDetails.banco}</p>
              <p><strong>CBU:</strong> {bankDetails.cbu}</p> 
              <p><strong>Alias:</strong> {bankDetails.alias}</p>
              <p><strong>Monto a transferir:</strong> ${totalPrice}</p>
            </div>
            <p className="bank-note">💡 Envía el comprobante de pago por WhatsApp o Correo. Una vez verificado, aprobaremos tu pedido</p>
            <br/>
            <button className="checkout-button" onClick={() => navigate("/perfil")}>Ver mis pedidos</button>
          </div>
        ) : (
          <>
          {/* 🟢 BOTÓN VOLVER (Visible arriba cuando el botón de Mercado Pago está activo para poder cancelar) */}
            {preferenceId && (
              <button 
                className="checkout-cancel-back-btn"
                onClick={() => navigate("/cart")}
                style={{
                  background: "#7185da",
                  color: "#f1f4f7",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginBottom: "20px",
                  fontWeight: "500"
                }}
              >
                ←  Cancelar 
              </button>
            )}
            {/* 🟢 No renderizar la lista si el carrito ya se limpió, pero mantener la estructura viva */}
            {cart.length > 0 && (
              <div className="checkout-products">
                {cart.map(item => (
                  <div key={`${item._id}-${item.size || "default"}`} className="checkout-item">
                    <div className="checkout-image">
                      <img 
                         src={
                              (() => {
                                 const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image;
                                        if (!imgSrc) return "";
                                        if (imgSrc.startsWith("http")) return imgSrc;
                                        return import.meta.env.BASE_URL + imgSrc.replace(/^\//, "");
                                      })()
                              } 
                              alt={item.title} 
                       />
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
            )}

            <div className="checkout-payment">
              <h3>Método de pago</h3>
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mercadopago"
                    checked={paymentMethod === "mercadopago"}
                    disabled={preferenceId} 
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
                    disabled={preferenceId} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Transferencia</span>
                </label>
              </div>

              {/* 🟢 El onReady ahora solo avisa, no destruye el carrito local para prevenir abandonos involuntarios antes de pagar */}
              {paymentMethod === "mercadopago" && preferenceId && (
                <div className="checkout-wallet" style={{ marginTop: '20px' }}>
                  <Wallet 
                    initialization={{ preferenceId }} 
                    onReady={() => {
                      console.log("Botón de Mercado Pago listo");
                      // RECOMENDACIÓN: Si prefieres vaciarlo sí o sí al aparecer el botón, puedes mantener clearCart() aquí.
                      // Con la nueva condición de arriba ya no se borrará la pantalla.
                      //clearCart(); 
                    }} 
                  />
                </div>
              )}
            </div>

            {!preferenceId && (
              <div className="checkout-summary">
                <h2>Total: ${totalPrice}</h2>
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
