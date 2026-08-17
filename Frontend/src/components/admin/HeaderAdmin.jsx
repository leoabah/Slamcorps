import { FaBell, FaChevronCircleDown, FaChevronDown } from "react-icons/fa";
import"../../styles/admin/_headerAdmin.scss"

export default function HearderAdmin(){
    return (
        <header className=" admin-header">
            <div className="header-left">
                <h1>Dashboard Admin</h1>
                <p>Panel de administracion </p>
            </div>

            <div className=" header-right">
                <button className="notification-btn">
                    <FaBell />
                    <span className="badge">0</span>
                </button>

                <div className="admin-user">
                    <img src="https:/ui-avatars.com/api/?name=Lionel=Abah&background=4f46e5&color=fff"
                     alt="Administrador" />

                     <div>
                        <h4>Lionel Abah</h4>
                        <span>Administrador</span>
                     </div>
                     <FaChevronDown />
                </div>

            </div>
        </header>
    );
}