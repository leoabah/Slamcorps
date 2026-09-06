import axios from "axios";

const contactApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "https://slamcorps.onrender.com"}/api/contacts`
});



export default contactApi;