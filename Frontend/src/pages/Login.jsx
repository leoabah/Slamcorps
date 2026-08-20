import { useState,useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { AuthContext } from "@/context/AuthContext";
import authApi from "../api/authApi";
import { validations } from "../utils/formValidations";
import "../styles/login.scss";
import { FaEye , FaEyeSlash } from "react-icons/fa";
 

export default function Login() {

    const { login }= useContext(AuthContext);

    const [showPassword, setShowPassword]= useState(false);

    const navigate = useNavigate();

    const [formData, setFormData]= useState({
        email:"",
        password:""
    });

    const [errors, setErrors]= useState({});

    const validateField = (name, value) => {
        let error = "";

        switch(name){

            case "email":
                if (
                    !validations.email.pattern.test(value)
                ){
                    error = validations.email.message;
                }

                break;

            case "password":

                if (
                    !validations.password.pattern.test(value)
                ){
                    error = validations.password.message;
                }

                break;

                default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]:error
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        validateField(name, value);
    };

    const validateForm = () => {

        validateField("email", formData.email);
        validateField("password", formData.password);

        return(
            validations.email.pattern.test(formData.email) &&
            validations.password.pattern.test(formData.password)
        );
    
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
                toast.error(
                    "Corrige los errores del formulario"
            );
            return;

        }
        try { 
            const response = await authApi.post(
                "/login",
                formData
            );

            login(
                response.data.user,
                response.data.token
            );

            toast.success(
                response.data.message
            );

            navigate("/");

        } catch(error) {
            console.log("ERROR COMPLETO:", error);

    console.log("RESPONSE:", error.response);

    console.log("DATA:", error.response?.data);
            toast.error(
                error.response?.data?.message ||
                 "Error al iniciar sesion"
            );
        }
    };

    return (

        <div className="login-page">

            <div className="login-container">

                <h1 className="login-title"
                >
                    Iniciar Sesion
                </h1>
        <form 
         className="login-form"
         onSubmit={handleSubmit}
         >

         <label>Email</label>

         <input
         type="email"
         name="email"
         placeholder="Ingresar tu email"
         value={formData.email}
         onChange={handleChange}
         />
         {errors.email && (
            <span className="error">
                {errors.email}
            </span>
         )}

         <label>Contraseña</label>

         <div 
         
         className="password-field">

         <input
           type={ showPassword ? "text":"password"}
           name="password"
           placeholder="contraseña"
           value={formData.password}
           onChange={handleChange}
           />
           {errors.password && (
               <span
               className="error">
                {errors.password}
            </span>
           )}
           <button
           type="button"
           className="toggle-password"
           onClick={() =>
           setShowPassword(!showPassword)
        }
        >
        {
           showPassword
        ? <FaEyeSlash />
        : <FaEye />
    }
        </button>
        </div>

           <button 
           className="btn-submit"
            type="submit">
            Ingresar
           </button>
    </form>

    <p 
    className="register-link">

        ¿No tienes cuenta?{" "}

        <Link to="/register">
          Registrate
        </Link>
    </p>

    </div>

    </div>
    );

}