import { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"
import orderApi from "../api/orderApi";
import "../styles/Profile.scss"

export default function Profile() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                // 🟢 CORRECCIÓN: La route du backend pour getMyOrders est la racine "/" du endpoint des commandes
                const response = await orderApi.get("/", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Error al obtener los pedidos:", error);
            }
        };
        getOrders();
    }, []);

    return (
        <div className="profile-page">
            <h1>Perfil</h1>
          
            {user?.role === "admin" && (
                <Link to="/admin" className="admin-link">
                    Dashboard Admin
                </Link>
            )}

            <div className="profile-card">
                <p><strong>Nombre:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Rol:</strong> {user?.role}</p>

                <h2>Mis Compras</h2>

                <div className="orders-container">
                    {orders.length === 0 ? (
                        <p>No posees compras todavía.</p>
                    ) : (
                        orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <p>
                                    <strong>Fecha:</strong>{" "}
                                    {order.createdAt
                                        // 🟢 CORRECCIÓN: Changement en toLocaleDateString pour afficher la date correcte
                                        ? new Date(order.createdAt).toLocaleDateString("es-AR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "Sin fecha"}
                                </p>

                                <ul>
                                    {order.products.map((item, index) => (
                                        <li key={`${item.productId?._id || index}-${item.size || "sin-talle"}`}>
                                            <strong>{item.productId?.title || "Producto no disponible"}</strong>
                                            {item.size && ` | talle: ${item.size}`}
                                            {` | cantidad: ${item.quantity}`}
                                        </li>
                                    ))}
                                </ul>

                                <p className="order-total">
                                    Total: \${(order.total || 0).toLocaleString("es-AR")}
                                </p>
                                <p className="order-status-badge">
                                    Estado: <span className={`status-${order.status?.toLowerCase()}`}>
                                        {order.status === "Pagado" ? "✅ Aprobado" : `⏳ ${order.status || "Pendiente"}`}
                                    </span>
                                </p>
                            </div>
                        ))
                    )}
                </div> 
            </div> 
        </div>
    );
}
