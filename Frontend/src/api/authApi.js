import axios from "axios";
 
const authApi = axios.create({
    baseURL: "https://libreria-cosmica-backend.onrender.com/api/auth/"
});

export default authApi;