import {
    FaChartPie,
    FaBook,
    FaShoppingCart,
    FaUsers,
    FaSignOutAlt
} from "react-icons/fa";

import "../../styles/admin/_sidebar.scss";

import { Link } from "react-router-dom";

export default function Sidebar(){

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
                    <li className="active">

                        <FaChartPie />

                        Dashboard

                    </li>
                    <li>
                        <FaBook />
                        Productos
                    </li>
                    <li>
                        <FaShoppingCart />
                        Pedidos
                    </li>
                    <li>
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