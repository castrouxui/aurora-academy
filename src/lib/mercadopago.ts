import MercadoPagoConfig from "mercadopago";

export const getMercadoPagoClient = () => {
    if (!process.env.MP_ACCESS_TOKEN) {
        throw new Error("MP_ACCESS_TOKEN is missing");
    }
    return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
};
