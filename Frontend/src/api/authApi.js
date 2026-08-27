// src/api/authApi.js
import axios from "axios";

const authApi = axios.create({
    // Apunta directo al puerto 3000 y al prefijo de autenticación que usa tu app.js
    baseURL: "http://localhost:3000/api/auth" 
});

export default authApi;
