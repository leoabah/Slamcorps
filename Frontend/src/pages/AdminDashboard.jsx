import { useEffect, useState, useMemo, useCallback } from "react";
import productsApi from "../api/productsApi";
import ordersApi from "../api/orderApi"; 
import "../styles/admin/adminDashboard.scss";

import Sidebar from "../components/admin/Sidebar";
import HeaderAdmin from "../components/admin/HeaderAdmin";
import ProductTable from "../components/admin/ProductTable";
import DashboardCards from "../components/admin/DashboardCards";
import SearchBar from "../components/admin/SearchBar";
import AnalyticsBox from "../components/admin/AnalyticsBox";

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
                const [productsRes, ordersRes] = await Promise.all([
                    productsApi.get("/"),
                    ordersApi.get("/").catch(() => ({ data: [] }))
                ]);

                if (!controller.signal.aborted) {
                    setProducts(productsRes.data);
                    setOrders(ordersRes.data);
                    
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
        sentOrders: orders.filter(o => o.status === "enviado").length,
        pendingOrders: orders.filter(o => o.status === "pendiente").length,
        newClients: orders.filter(o => o.isNew).length
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

    return (
        <div className="admin-layout">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="admin-content">
                <HeaderAdmin />

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
                            <div className="products-view">
                                <DashboardCards
                                    view="productos"
                                    totalProducts={metrics.totalProducts}
                                    totalStock={metrics.totalStock}
                                    totalValue={metrics.totalValue}
                                />

                                <div className="products-section">
                                    <div className="products-top">
                                        <h2>Productos</h2>
                                        <SearchBar search={search} setSearch={setSearch} />
                                    </div>

                                    <ProductTable
                                       products={filteredProducts}
                                       handleDelete={handleDelete}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
