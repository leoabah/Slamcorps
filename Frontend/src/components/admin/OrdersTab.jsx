import { useState } from "react";
import { toast } from "react-hot-toast";
import orderApi from "../../api/orderApi"; // Asegúrate de que esta sea la ruta real a tu Axios

function formatDate(date) {
    return date ? new Date(date).toLocaleDateString("es-AR") : "-";
}

function OrderProducts({ products = [] }) {
    if (products.length === 0) return <span>-</span>;

    return (
        <ul className="order-products-list">
            {products.map((item, index) => (
                <li key={item.productId?._id || `${item.size}-${index}`}>
                    <strong>{item.productId?.title || "Producto no disponible"}</strong>
                    <small>
                        Talle: {item.size || "-"} | Cantidad: {item.quantity || 0}
                    </small>
                </li>
            ))}
        </ul>
    );
}

export default function OrdersTab({ orders: initialOrders }) {
    // Estado local reactivo para ver los cambios inmediatamente sin recargar
    const [orders, setOrders] = useState(initialOrders);


    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Petición PUT al backend para guardar en la Base de Datos
            await orderApi.put(`/${orderId}/status`, { status: newStatus });
            
            // Actualización del estado en el cliente de forma reactiva
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            
            toast.success(`Pedido actualizado a ${newStatus === "Pagado" ? "Aprobado" : newStatus} con éxito`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error al modificar el estado de la orden");
        }
    };

    return (
        <div className="admin-data-view">
            <div className="admin-section-header">
                <h2>Pedidos</h2>
                <span>{orders.length} pedidos</span>
            </div>

            {orders.length === 0 ? (
                <p className="admin-empty-state">Todavía no hay pedidos registrados.</p>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-data-table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Detalle de productos</th>
                                <th>Total</th>
                                <th>Pago</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <strong>{order.user?.name || "Cliente sin datos"}</strong>
                                        <small>{order.user?.email || "-"}</small>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td><OrderProducts products={order.products} /></td>
                                    <td>\${(order.total || 0).toLocaleString("es-AR")}</td>
                                    <td style={{ textTransform: "capitalize" }}>
                                        {order.paymentMethod || "Pendiente"}
                                    </td>
                                    <td>
                                        {/* 🔀 CONDICIÓN EXCLUSIVA: Si es transferencia habilita el selector interactivo */}
                                        {order.paymentMethod === "transferencia" ? (
                                            <select
                                                value={order.status || "Pendiente"}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`admin-status-select ${order.status?.toLowerCase()}`}
                                                style={{
                                                    padding: "6px 12px",
                                                    borderRadius: "6px",
                                                    fontWeight: "600",
                                                    cursor: "pointer",
                                                    border: "1px solid #ccc",
                                                    backgroundColor: "#1b2237",
                                                    color: "#Fdfbf7"
                                                }}
                                            >
                                                <option value="Pendiente">⏳ Pendiente</option>
                                                <option value="Pagado">✅ Aprobado</option> {/* Guarda 'Pagado' en MongoDB conforme a tu enum */}
                                                <option value="Cancelado">❌ Cancelado</option>
                                            </select>
                                        ) : (
                                            /* Si es Mercado Pago, se visualiza fijo en modo solo lectura */
                                            <span 
                                                className={`admin-status-badge ${order.status?.toLowerCase()}`}
                                                style={{ fontWeight: "600", color: "#Fdfbf7" }}
                                            >
                                                {order.status === "Pagado" ? "✅ Aprobado" : `⏳ ${order.status || "Pendiente"}`}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
