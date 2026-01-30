
import { MercadoPagoConfig, Payment, PreApproval } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const token = process.env.MP_ACCESS_TOKEN;
console.log("Token Prefix:", token?.substring(0, 10));

async function checkPayments() {
    if (!token) return;

    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);
    const preApproval = new PreApproval(client);

    try {
        console.log("--- SEARCHING PAYMENTS (No Options) ---");
        const paymentSearch = await payment.search({});
        console.log("Payment Results Count:", paymentSearch.results?.length);
        if (paymentSearch.results && paymentSearch.results.length > 0) {
            paymentSearch.results.slice(0, 5).forEach((p: any) =>
                console.log(`[PAYMENT] ${p.date_created} | ${p.status} | ${p.payer?.email}`)
            );
        }

        console.log("\n--- SEARCHING SUBSCRIPTIONS (No Options) ---");
        const subSearch = await preApproval.search({});
        console.log("Sub Results Count:", subSearch.results?.length);
        if (subSearch.results && subSearch.results.length > 0) {
            subSearch.results.slice(0, 5).forEach((s: any) =>
                console.log(`[SUB] ${s.date_created} | ${s.status} | ${s.payer_email}`)
            );
        }

    } catch (error) {
        console.error("Error searching:", error);
    }
}

checkPayments();
