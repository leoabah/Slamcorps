import axios from "axios";

 const orderApi = axios.create({
    baseURL:"https://slamcorps.onrender.com/api/orders"
 });
  export default orderApi;