import axios from "axios";


const productsApi = axios.create({
    baseURL:
   "https://slamcorps.onrender.com/api/products"
});
export default productsApi;