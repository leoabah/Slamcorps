import {
    FaChartPie,
    FaBook,
    FaShoppingCart,
    FaUsers,
    FaSignOutAlt
} from "react-icons/fa";

import "../../styles/admin/_sidebar.scss";

export default function Sidebar({activeTab, setActiveTab}){

    return(
        <aside className="sidebar">

            <div className="sidebar-logo">

                <div className="logo-circle">
                    
                </div>

                <h2>Libreria</h2>

                <span>Cosmica</span>

                <small>ADMIN</small>

            </div>

            <nav>
                <ul>
                    <li className={activeTab === "inicio"?
                        "active": ""}
                        onClick={() => setActiveTab("inicio")}
                        style={{cursor:"pointer"}}
                    >

                        <FaChartPie />

                        Dashboard

                    </li>
                    <li
                    className={activeTab === "productos" ?
                        "active" : ""}
                        onClick={() => setActiveTab("productos")}
                        style={{cursor:"pointer"}}
                    >
                        <FaBook />
                        Productos
                    </li>
                    <li>
                        <FaShoppingCart />
                        Pedidos
                    </li>
                    <li >
                        <FaUsers />
                        Clientes
                    </li>
                </ul>

            </nav>

            <button className="Logout">

                <FaSignOutAlt />

                Cerrar sesion

            </button>

        </aside>
    );
}