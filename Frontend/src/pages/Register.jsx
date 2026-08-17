import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast"
import { validations } from "../utils/formValidations";
import authApi from "../api/authApi";
import "../styles/register.scss";
import { FaEyeSlash, FaEye } from "react-icons/fa";

export default function Register(){

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData]= useState({
        name:"",
        email:"",
        password:""
    });

    const  [errors, setErrors] = useState({});

    const  validationsField = ( name, value) => {

        let error = "";

        switch(name){

            case "name":
        
        if (
            !validations.name.pattern.test(value)
        ){
            error = validations.name.message;
        }
        break;

        case "email":
        if(
            !validations.email.pattern.test(value)
            ){
               error = validations.email.message;
            }
            break;

        case "password":
        if(
            !validations.password.pattern.test(value)
        ){
            error = validations.password.message;
      }
      break;
      default:
      break;
    };

    setErrors(prev => ({
        ...prev,
        [name]: error
    }));
};

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev =>({
        ...prev,
        [name]: value
    }));
    validationsField(name, value);
};

const validationsForm = () => {
    if(
        !validations.name.pattern.test(formData.name)
    ) return false;
    if(
        !validations.email.pattern.test(formData.email)
    ) return false;
    if(
        !validations.password.pattern.test(formData.password)
    ) return false;

    return true;
};




    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!validationsForm()) return;

        try{
            const response =
            await authApi.post(
                "/register",
                formData
            );
            toast.success(
                response.data.message
            );

            setFormData({
                name:"",
                email:"",
                password:""
            });

        } catch(error){

            toast.error(
                error.response?.data?.msg ||
                "Error al registrar usuario"
            );
        }
    };

    return(

        <div
          className="register-page"
        >
            <div
            className="register-container"
            >

            <h1
            className="register-title"
            >
            Crear Cuenta
            </h1>

            <form 
            className="register-form"
            onSubmit={handleSubmit}
            >
                <label>Nombre Completo</label>

                <input
                type= "text"
                name= "name"
                placeholder = "Nombre"
                value= {formData.name}
                onChange={handleChange}
                />
                {errors.name && (
                    <span className="error">
                        {errors.name}
                    </span>
                )}
                <label>Email</label>

                <input
                 type="email"
                 name="email"
                 placeholder="Email"
                 value={formData.email}
                 onChange={handleChange}
                 />
                { errors.email && (
                    <span className="error">
                        {errors.email}
                    </span>
                )}

                <label>Contraseña</label>

                <div 
                className="password-field"
                >

                <input
                 type={ showPassword ? "text" : "password"}
                 name = "password"
                 placeholder =  "contraseña"
                 value={formData.password}
                 onChange={handleChange}
                 />
                  { errors.password && (
                      <span className="error">
                        {errors.password}
                    </span>
                )}
                <button
                type="button"
                className="toggle-password"
                onClick={() =>
                    setShowPassword(!showPassword)
                }>
                    {showPassword 
                    ?<FaEyeSlash />
                    : <FaEye />
                }
                </button>
                </div>

                 <button 
                 className="btn-submit"
                 type = "submit"
                 >
                    Registrarse
                 </button>   

            </form>
            <p 
            className="register-link">
           ¿Ya tienes cuenta?{" "}
        <Link to="/login">
          Iniciar Sesion
        </Link>
    </p>
        </div>
        </div>
    );
}
