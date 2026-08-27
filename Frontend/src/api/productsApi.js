import axios from "axios";


const productsApi = axios.create({
    baseURL:
   import.meta.env.VITE_API_URL || "http://localhost:3000/api/products"
});
export default productsApi;