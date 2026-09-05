import {
    FaBook,
    FaBoxes,
    FaDollarSign,
    FaShoppingCart,
    FaChartLine
} from "react-icons/fa";

export default function DashboardCards({
    view,
    totalProducts,
    totalStock,
    totalValue,
    totalOrders = 0,
    totalEarning = 0
}){
    // 📊 MODO 1: Pestaña de Inicio (Métricas Globales de Ventas)
    if (view === "inicio"){
        return(
            /* 🚨 CORRECCIÓN 1: El contenedor padre debe usar 'admin-cards' en plural para heredar el Grid layout */
            <div className="admin-cards general-mode">
                
                {/* Tarjeta 1: Ingresos */}
                <div className="admin-card geometry-box">
                    {/* Corregido typo 'monkey' por 'money' para tus estilos del ícono */}
                    <div className="card-icon money">
                        <FaDollarSign />
                    </div>
                    <h3>Ingresos Totales</h3>
                    <span>${totalEarning.toLocaleString("es-AR")}</span>
                    <small>Ventas netas generadas</small>
                </div>

                {/* Tarjeta 2: Pedidos */}
                <div className="admin-card geometry-box">
                    {/* Corregido typo 'Card-icon ordes' por 'card-icon orders' */}
                    <div className="card-icon orders">
                        <FaShoppingCart />
                    </div>
                    <h3>Pedidos Realizados</h3>
                    <span>{totalOrders}</span>
                    <small>Órdenes en total</small>
                </div>

                {/* Tarjeta 3: Catálogo */}
                {/* 🚨 CORRECCIÓN 2: Esta etiqueta estaba rota como 'card-icon'. Debe ser un 'admin-card' */}
                <div className="admin-card geometry-box">
                    <div className="card-icon performance">
                        <FaChartLine />
                    </div>
                    <h3>Total Productos</h3>
                    <span>{totalProducts}</span>
                    <small>Modelos en catálogo</small>
                </div>
            </div>
        );
    }
    
    // 📦 MODO 2: Pestaña de Productos (Métricas de Inventario)
    return( 
        /* Corregido typo 'invientory-mode' por 'inventory-mode' */
        <div className="admin-cards inventory-mode">
            <div className="admin-card">
                <div className="card-icon product">
                    <FaBook />
                </div>
                <h3>Productos</h3>
                <span>{totalProducts}</span>
                <small>Total de Productos</small>
            </div>

            <div className="admin-card">
                <div className="card-icon stock">
                    <FaBoxes />
                </div> 
                <h3>Stock total</h3>
                <span>{totalStock}</span>
                <small>Unidades disponibles</small>
            </div>

            <div className="admin-card">
                <div className="card-icon money">
                    <FaDollarSign />
                </div>
                <h3>Valor Inventario</h3>
                <span>${totalValue.toLocaleString("es-AR")}</span>
                <small>Total realizados</small>
            </div>
        </div>
    );
}
