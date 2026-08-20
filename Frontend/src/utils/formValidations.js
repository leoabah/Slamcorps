export const validations = {



    name:{
        required: true,
        pattern:
        /^[A-Za-zÀ-ÿ\s]{3,40}$/,
        message: 
        "el nombre debe tener entre 3 y 40 caracteres"
    },
    title:{
        required: true,
        pattern:
        /^[A-Za-zÀ-ÿ0-9\s]{3,40}$/,
        message: 
        "el título debe tener entre 3 y 40 caracteres"
    },
    price:{
        required: true,
        pattern: 
        /^[1-9][0-9]*$/,
        message: 
        "solo numero positivos"
    },
    descripcion:{
        required: true ,
        pattern:
        /^.{10,500}$/,
        message:
        "La descripción debe tener entre 10 y 500 caracteres"
    },
    email:{
        required:true,
        pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message:"Email invalido"
    },
    password:{
        required:true,
        pattern:/^.{6,20}$/,
        message: "La contrasena debe tener entre 6 y 20 caracteres"
    }

};