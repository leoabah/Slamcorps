import { MercadoPagoConfig } from "mercadopago";
import dotenv from "dotenv";

dotenv.config(); // Asegura la lectura del .env

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.error("❌ ERROR: La variable MERCADOPAGO_ACCESS_TOKEN no está definida en el .env");
}

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

export default client;
