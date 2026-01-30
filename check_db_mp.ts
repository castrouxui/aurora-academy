
import { PrismaClient } from '@prisma/client';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function checkDB() {
    try {
        const count = await prisma.purchase.count();
        console.log(`Local DB Purchase Count: ${count}`);

        const lastPurchase = await prisma.purchase.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (lastPurchase) {
            console.log("\nLast Local Purchase:");
            console.log(lastPurchase);

            if (process.env.MP_ACCESS_TOKEN) {
                console.log("\nAttempting to fetch this payment from MP...");
                const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
                const payment = new Payment(client);
                try {
                    const mpPayment = await payment.get({ id: lastPurchase.paymentId as any });
                    console.log("SUCCESS! Found in MP:");
                    console.log(`ID: ${mpPayment.id}, Status: ${mpPayment.status}, Payer: ${mpPayment.payer?.email}`);
                } catch (e: any) {
                    console.error("FAILED to find in MP:", e.message || e);
                    console.log("Hypothesis: Token mismatch (Wrong Account).");
                }
            }
        } else {
            console.log("No purchases in local DB.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDB();
