import axios from "axios";

 const orderApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/orders`
 });
  export default orderApi;