function getClientsFromOrders(orders) {
    const clients = new Map();

    orders.forEach((order) => {
        if (order.user?._id) {
            clients.set(order.user._id, order.user);
        }
    });

    return Array.from(clients.values());
}

export default function ClientsTab({ orders }) {
    const clients = getClientsFromOrders(orders);

    return (
        <div className="admin-data-view">
            <div className="admin-section-header">
                <h2>Clientes</h2>
                <span>{clients.length} clientes</span>
            </div>

            {clients.length === 0 ? (
                <p className="admin-empty-state">Todavía no hay clientes con pedidos registrados.</p>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-data-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client._id}>
                                    <td>{client.name}</td>
                                    <td>{client.email}</td>
                                    <td>{client.role || "customer"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}