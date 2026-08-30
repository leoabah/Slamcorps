import axios from "axios";

const ordersApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "https://slamcorps.onrender.com"}/api/orders`
});

export default ordersApi;
