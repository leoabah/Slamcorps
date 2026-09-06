// src/api/smsApi.js
import axios from "axios";

const smsApi = axios.create({
    // Apunta directo al puerto 3000 y al prefijo de autenticación que usa tu app.js
    baseURL: `${import.meta.env.VITE_API_URL || "https://slamcorps.onrender.com"}/api/sms`
});

export default smsApi;

