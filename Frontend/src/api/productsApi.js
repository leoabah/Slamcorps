import axios from "axios";


const productsApi = axios.create({
    baseURL:
   "https://libreria-cosmica-backend.onrender.com/api/products"
});
export default productsApi;