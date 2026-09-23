export const validations = {
    name: {
        required: true,
        pattern: /^[A-Za-zÀ-ÿ\s]{3,40}$/,
        message: "el nombre debe tener entre 3 y 40 caracteres"
    },
    title: {
        required: true,
        pattern: /^[A-Za-zÀ-ÿ0-9\s\-_./]{3,50}$/, // 🟢 Se amplió un poco para permitir guiones o barras en nombres de ropa (Ej: T-Shirt)
        message: "el título debe tener entre 3 y 50 caracteres"
    },
    price: {
        required: true,
        pattern: /^[1-9][0-9]*$/,
        message: "solo números positivos"
    },
    description: {
        required: true,
        pattern: /^[\s\S]{10,500}$/, // 🟢 Cambiado a [\s\S] para que acepte saltos de línea (Enter) en la descripción del producto sin fallar
        message: "La descripción debe tener entre 10 y 500 caracteres"
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Email inválido"
    },
    password: {
        required: true,
        pattern: /^.{6,20}$/,
        message: "La contraseña debe tener entre 6 y 20 caracteres"
    },
    // 🟢 NUEVA REGLA ADAPTADA PARA EL OBJETO STOCK
    // Al dejar required en false o no poner pattern, tu nuevo useForm (que modificamos antes) 
    // entenderá que es un objeto y no intentará romper la aplicación aplicando un Regex string.
    stock: {
        required: false 
    }
};
