import { useMemo } from "react";

export default function AnalyticsBox({ sentOrders, pendingOrders, newClients, orders }) {
    // Calcular altura de las barras basada en proporciones reales
    const maxOrders = Math.max(sentOrders, pendingOrders, 1);
    
    const barHeights = useMemo(() => ({
        sent: (sentOrders / maxOrders) * 100 || 10,
        pending: (pendingOrders / maxOrders) * 100 || 10,
        clients: (newClients / Math.max(newClients, 10)) * 100 || 10
    }), [sentOrders, pendingOrders, newClients]);

    // Obtener top 5 órdenes por valor
    const topOrders = useMemo(() => 
        orders
            .sort((a, b) => (b.total || 0) - (a.total || 0))
            .slice(0, 5)
            .map((order, index) => ({
                rank: index + 1,
                total: `$${order.total?.toFixed(2) || 0}`
            })),
        [orders]
    );

    return (
        <div className="charts-grid-layout">
            <div className="analytics-box">
                
                {/* Barra 1: Pedidos Enviados */}
                <div className="bar-group">
                    <div className="bar-wrapper">
                        <div 
                            className="actual-bar sent-bar" 
                            style={{ height: `${barHeights.sent}%` }}
                        >
                            <span className="bar-value">{sentOrders}</span>
                        </div>
                    </div>
                    <span className="bar-label">Pedidos Enviados</span>
                </div>

                {/* Barra 2: Pedidos Pendientes */}
                <div className="bar-group">
                    <div className="bar-wrapper">
                        <div 
                            className="actual-bar pending-bar" 
                            style={{ height: `${barHeights.pending}%` }}
                        >
                            <span className="bar-value">{pendingOrders}</span>
                        </div>
                    </div>
                    <span className="bar-label">Pedidos Pendientes</span>
                </div>

                {/* Tabla: Ventas por Cliente */}
                <div className="sales-client-list">
                    {topOrders.map(order => (
                        <div key={order.rank} className="client-row">
                            <span>{order.rank}</span>
                            <strong>{order.total}</strong>
                        </div>
                    ))}
                    <span className="bar-label list-title">Ventas por Cliente</span>
                </div>

                {/* Barra 3: Nuevos Clientes */}
                <div className="bar-group">
                    <div className="bar-wrapper">
                        <div 
                            className="actual-bar clients-bar" 
                            style={{ height: `${barHeights.clients}%` }}
                        >
                            <span className="bar-value">{newClients}</span>
                        </div>
                    </div>
                    <span className="bar-label">Nuevos Clientes</span>
                </div>

            </div>
        </div>
    );
}
