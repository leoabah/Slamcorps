import { useState } from 'react'
import { toast } from 'react-toastify';

export default function useForm(
    initialState, validations
){
    const [form,setForm]=
    useState(initialState);
    const [errors, setErrors]=
    useState(
        {}
    );
     const handleChange = (e) => {
      const { name, value }= 
      e.target;
      setForm({
        ...form,
        [name]:value
    });
};

const validateField = (
    name , value) => {
        const rule =
        validations[name];
        if(!rule) return "";
        // Si el campo no existe en el form (por ejemplo, quedó una
        // regla vieja apuntando a un nombre que ya cambió), value
        // llega undefined. Con "?." evitamos el crash y lo tratamos
        // como campo vacío en vez de romper toda la app.
        if(
            rule.required 
            &&
            !value?.trim()
        ){
            return "Campo obligatorio"
        }
        if(
            rule.pattern && !rule.pattern.test(value ?? "")
        ){
            return rule.message;
        }
        return "";
    };

const handleBlur = (e) =>{
    const{ name, value } =
    e.target;

    const error =
    validateField(name, value);

    setErrors({
        ...errors,
        [name]: error
    });
};

const validateForm = () => {
    let newErrors = {};
    // Antes recorría TODAS las claves de "validations" (el archivo
    // compartido entre formularios). Eso hacía que campos de OTROS
    // formularios (ej: email, password del login) se validaran acá
    // también, aunque no existan en este form, y fallaran siempre
    // por ser "obligatorios" y llegar undefined.
    // Ahora solo valida los campos que existen en el form actual.
    Object.keys(form)
    .forEach(field => {
        const error =
        validateField(field, form[field]);
        if(error) {
            newErrors[field]= error;
        }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
}
    const handleSubmit =
    (callback) => (e) => {
        e.preventDefault();
        if (validateForm()){
            callback(form);
        }else {
            toast.error(
                "Revisa los campos"
            );
        }
    };
    return {
        form,
        errors,
        handleChange,
        handleBlur,
        handleSubmit
    };
}