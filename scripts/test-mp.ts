import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// Also try .env.local if needed
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const token = process.env.MP_ACCESS_TOKEN;
console.log("Using Token:", token ? token.substring(0, 10) + "..." : "MISSING");

if (!token) {
    console.error("MP_ACCESS_TOKEN not found in .env files");
    process.exit(1);
}

const client = new MercadoPagoConfig({ accessToken: token });

async function testPreference() {
    try {
        const preference = new Preference(client);
        const preferenceData = {
            items: [
                {
                    id: 'test-item',
                    title: 'Test Item',
                    unit_price: 100,
                    quantity: 1,
                }
            ],
            // Ensure back_urls is strictly typed or structurally correct
            back_urls: {
                success: "http://localhost:3000/success",
                failure: "http://localhost:3000/failure",
                pending: "http://localhost:3000/pending"
            },
            auto_return: 'approved',
        };

        console.log("Sending Body:", JSON.stringify(preferenceData, null, 2));

        const result = await preference.create({
            body: preferenceData
        });
        console.log("Preference created successfully!");
        console.log("ID:", result.id);
        console.log("Init Point:", result.init_point);
    } catch (error: any) {
        console.error("Mercado Pago Error:", error);
        if (error.cause) console.error("Cause:", JSON.stringify(error.cause, null, 2));
    }
}

testPreference();
