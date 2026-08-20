import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import AboutUs from '../pages/AboutUs'
import { Alta } from '../pages/Alta'
import Cart from '../pages/Cart'
import EditProduct from "@/pages/EditProduct"
import ProductDetail from "@/pages/ProductDetail"
import Contact from '../pages/Contact'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile  from "../pages/Profile";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from '../pages/AdminDashboard'


const AppRouter = () => {
  return (
    <Routes>

      <Route
        path="/" 
        element={
        <Home />
        } />

      <Route 
        path="/admin" 
        element={
          <AdminDashboard />
      } />

      <Route 
        path="/perfil"
        element={
        <PrivateRoute>
          <Profile/>
        </PrivateRoute>
        }  />

      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/edit/:id" element={<EditProduct />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/alta" element={
        <PrivateRoute>
        <Alta />
        </PrivateRoute>
      } />

    </Routes>
  )
}

export default AppRouter