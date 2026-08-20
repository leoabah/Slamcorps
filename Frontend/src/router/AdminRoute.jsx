import { Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function AdminRoute({ children }) {
    const { user } = useContext(AuthContext);

    // Caso 1: no hay usuario logueado -> al login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Caso 2: hay usuario, pero no es admin -> lo mandamos al home,
    // no al login, porque SÍ está logueado, solo no tiene permiso.
    // Ajustá esta condición según cómo guardes el rol en tu backend:
    //   - si es user.role === "admin"
    //   - si es user.isAdmin === true
    if (user.role !== "admin") {
        return <Navigate to="/" />;
    }

    // Caso 3: es admin -> lo dejamos pasar
    return children;
}
