import {
    FaChartPie,
    FaBook,
    FaShoppingCart,
    FaUsers,
    FaEnvelope,
    FaSignOutAlt
} from "react-icons/fa";

import "../../styles/admin/_sidebar.scss";

export default function Sidebar({activeTab, setActiveTab}){

    return(
        <aside className="sidebar">

            <div className="sidebar-logo">

                <div className="logo-circle">
                    
                </div>

                <h2>Slam</h2>

                <span>Corps</span>

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
                    <li
                        className={activeTab === "pedidos" ? "active" : ""}
                        onClick={() => setActiveTab("pedidos")}
                        style={{cursor:"pointer"}}
                    >
                        <FaShoppingCart />
                        Pedidos
                    </li>
                    <li
                        className={activeTab === "clientes" ? "active" : ""}
                        onClick={() => setActiveTab("clientes")}
                        style={{cursor:"pointer"}}
                    >
                        <FaUsers />
                        Clientes
                    </li>
                    <li
                        className={activeTab === "mensajes" ? "active" : ""}
                        onClick={() => setActiveTab("mensajes")}
                        style={{cursor:"pointer"}}
                    >
                        <FaEnvelope />
                        Mensajes
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