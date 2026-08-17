import axios from "axios";

 const orderApi = axios.create({
    baseURL:"https://libreria-cosmica-backend.onrender.com/api/orders"
 });
  export default orderApi;