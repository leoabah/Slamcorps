import axios from "axios";

const ordersApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/orders` // Esto se transforma en http://localhost:3000/api/orders
});

export default ordersApi;
