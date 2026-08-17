
import {
    FaBook,
    FaBoxes,
    FaDollarSign,
    FaShoppingCart
} from "react-icons/fa";

export default function DashboardCards({
    totalProducts,
    totalStock,
    totalValue,
    totalOrders
}){
    return( 
    <div className="admin-cards">
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
            <span>
                $
                {totalValue.toLocaleString("es-AR")}
            </span>
            <small>Total realizados</small>
        </div>

    </div>
    )
}
