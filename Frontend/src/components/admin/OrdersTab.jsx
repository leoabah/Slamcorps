function formatDate(date) {
    return date ? new Date(date).toLocaleDateString("es-AR") : "-";
}

export default function OrdersTab({ orders }) {
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
                                <th>Productos</th>
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
                                    <td>{order.products?.reduce((total, item) => total + item.quantity, 0) || 0}</td>
                                    <td>${(order.total || 0).toLocaleString("es-AR")}</td>
                                    <td>{order.paymentMethod || "Pendiente"}</td>
                                    <td>{order.status || "Pendiente"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}