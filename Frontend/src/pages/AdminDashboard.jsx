import { useEffect, useState, useMemo, useCallback } from "react";
import productsApi from "../api/productsApi";
import ordersApi from "../api/orderApi"; 
import contactApi from "../api/contactApi";
import "../styles/admin/adminDashboard.scss";

import Sidebar from "../components/admin/Sidebar";
import HeaderAdmin from "../components/admin/HeaderAdmin";
import DashboardCards from "../components/admin/DashboardCards";
import AnalyticsBox from "../components/admin/AnalyticsBox";
import ProductsTab from "../components/admin/ProductsTab";
import OrdersTab from "../components/admin/OrdersTab";
import ClientsTab from "../components/admin/ClientsTab";
import MessagesTab from "../components/admin/MessagesTab";

const INITIAL_STATE = {
    activeTab: "inicio",
    search: "",
    products: [],
    orders: [],
    messages: [],
    totalSalesValue: 0,
    isLoading: true,
    error: null
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState(INITIAL_STATE.activeTab);
    const [search, setSearch] = useState(INITIAL_STATE.search);
    const [products, setProducts] = useState(INITIAL_STATE.products);
    const [orders, setOrders] = useState(INITIAL_STATE.orders);
    const [messages, setMessages] = useState(INITIAL_STATE.messages);
    const [totalSalesValue, setTotalSalesValue] = useState(INITIAL_STATE.totalSalesValue);
    const [isLoading, setIsLoading] = useState(INITIAL_STATE.isLoading);
    const [error, setError] = useState(INITIAL_STATE.error);

    // Cargar datos al montar el componente
    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [productsRes, ordersRes, contactsRes] = await Promise.all([
                    productsApi.get("/"),
                    ordersApi.get("/").catch(() => ({ data: [] })),
                    contactApi.get("/").catch(() => ({ data: [] }))
                ]);

                if (!controller.signal.aborted) {
                    setProducts(productsRes.data);
                    setOrders(ordersRes.data);
                    setMessages(contactsRes.data);
                    
                    const total = ordersRes.data.reduce((acc, order) => acc + (order.total || 0), 0);
                    setTotalSalesValue(total);
                }
            } catch(error) {
                if (!controller.signal.aborted) {
                    console.error("Error cargando datos del dashboard:", error);
                    setError("No se pudieron cargar los datos");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        })();

        return () => controller.abort();
    }, []);

    // Filtrado de productos optimizado
    const filteredProducts = useMemo(() => 
        products.filter(product => 
            product.title?.toLowerCase().includes(search.toLowerCase())
        ),
        [products, search]
    );

    // Cálculos de métricas optimizados
    const metrics = useMemo(() => ({
        totalProducts: products.length,
        totalStock: products.reduce((acc, product) => acc + (product.stock || 0), 0),
        totalValue: products.reduce((acc, product) => acc + ((product.price || 0) * (product.stock || 0)), 0),
        sentOrders: orders.filter(o => o.status === "Pagado").length,
        pendingOrders: orders.filter(o => o.status === "Pendiente").length,
        newClients: new Set(orders.map(order => order.user?._id).filter(Boolean)).size
    }), [products, orders]);

    // Manejador de eliminación de producto
    const handleDelete = useCallback(async(id) => {
        if (!window.confirm("¿Eliminar producto?")) return;

        try {
            await productsApi.delete(`/${id}`);
            setProducts(prev => prev.filter(product => product._id !== id));
        } catch(error) {
            console.error("Error al eliminar producto:", error);
            setError("No se pudo eliminar el producto");
        }
    }, []);

    //menssage como leido indiciando el id del mensaje
    const handleReadMessage = useCallback(async (id) => {
        try {
            await contactApi.patch(`/${id}/read`);
            setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, isRead: true } : msg));
        } catch (error) {
            console.error("Error al marcar el mensaje como leído:", error);
            setError("No se pudo marcar el mensaje como leído");
        }
    }, []);

    return (
        <div className="admin-layout">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="admin-content">
                <HeaderAdmin
                    orderCount={orders.length}
                    onOrdersClick={() => setActiveTab("pedidos")}
                />

                {error && (
                    <div className="error-message" style={{ padding: "20px", color: "#d32f2f", backgroundColor: "#ffebee", borderRadius: "4px", margin: "20px" }}>
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div style={{ padding: "40px", textAlign: "center" }}>Cargando...</div>
                ) : (
                    <>
                        {/* 📊 PESTAÑA 1: INICIO (VISTA GENERAL) */}
                        {activeTab === "inicio" && (
                            <div className="dashboard-view">
                                <DashboardCards
                                    view="inicio"
                                    totalProducts={metrics.totalProducts}
                                    totalOrders={orders.length}
                                    totalValue={totalSalesValue}
                                />
                                <AnalyticsBox 
                                    sentOrders={metrics.sentOrders}
                                    pendingOrders={metrics.pendingOrders}
                                    newClients={metrics.newClients}
                                    orders={orders}
                                />
                            </div>
                        )}

                        {/* 📦 PESTAÑA 2: PRODUCTOS */}
                        {activeTab === "productos" && (
                            <ProductsTab
                                products={filteredProducts}
                                search={search}
                                setSearch={setSearch}
                                totalProducts={metrics.totalProducts}
                                totalStock={metrics.totalStock}
                                totalValue={metrics.totalValue}
                                handleDelete={handleDelete}
                            />
                        )}
                        {activeTab === "pedidos" && <OrdersTab orders={orders} />}
                        {activeTab === "clientes" && <ClientsTab orders={orders} />}
                        {activeTab === "mensajes" && (
                            <MessagesTab messages={messages} onRead={handleReadMessage} />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
