
import { useState } from 'react'

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
        if(
            rule.required 
            &&
            !value.trim()
        ){
            return "Campo obligatorio"
        }
        if(
            rule.pattern && !rule.pattern.test(value)
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
    Object.keys(validations)
    .forEach(field => {
        const error =
        validateField(field, form[field]);
        if(error) {
            newErrors[field]= error;
        }
        setErrors(newErrors);
    });
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
