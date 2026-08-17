


export const validations = {
    
    name:{
        required: true,
        pattern:
        /^[A-Za-zÀ-ÿ\s]{3,40}$/,
        message: 
        "el nombre debe tener entre 3 y 40 caracteres"
    },
    price:{
        required: true,
        pattern: 
        /^[1-9][0-9]*$/,
        message: 
        "solo numero positivos"
    },
    age: {
        required: true,
        pattern:
        /^[0-9]{1,2}$/,
        message:
        "Edad invalida"
    },
    shortDescription:{
        required: true ,
        pattern:
        /^.{10,100}$/,
        mensage:
        "Minimo 10 caracteres"
    },
    longDescription:{
        required:true,
        pattern: 
        /^.{20,500}$/,
        message:
        "Minimo 20 caracteres"
    },
    name:{
        required:true,
        pattern:/^[A-Za-zÀ-ÿ\s]{3,40}$/,
        message: "El nombre debe tener entre 3 y 40 caracteres"
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

