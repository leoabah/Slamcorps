import axios from "axios";

const ordersApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "https://slamcorps.onrender.com"}/api/orders`
});

ordersApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default ordersApi;
