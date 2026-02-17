import { prisma } from "../src/lib/prisma";

async function simulateRefund(paymentId: string) {
    console.log(`Simulating refund for payment ${paymentId}...`);

    try {
        const res = await fetch("http://localhost:3000/api/webhooks/mercadopago?topic=payment&id=" + paymentId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("Webhook response status:", res.status);
        console.log("Webhook response body:", await res.json());

    } catch (e) {
        console.error("Error simulating webhook:", e);
    }
}

// simulateRefund("YOUR_TEST_PAYMENT_ID");
console.log("Please run this script with a valid payment ID to test.");
