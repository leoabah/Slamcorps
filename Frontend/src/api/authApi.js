import axios from "axios";
 
const authApi = axios.create({
    baseURL: "https://slamcorps.onrender.com/api/auth/"
});

export default authApi;