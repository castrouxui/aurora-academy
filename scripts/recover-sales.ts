
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config(); // Fallback to .env

if (!process.env.MP_ACCESS_TOKEN) {
    console.error("MP_ACCESS_TOKEN is missing");
    process.exit(1);
}

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const payment = new Payment(client);
const prisma = new PrismaClient();

async function main() {
    console.log("Fetching recent approved payments from MercadoPago...");

    const token = process.env.MP_ACCESS_TOKEN || "";
    console.log(`Debug: Token prefix: ${token.substring(0, 15)}...`);

    try {
        console.log("Searching recent payments (simplified)...");
        const searchResult = await payment.search({
            options: {
                limit: 100,
                offset: 0,
                sort: 'date_created',
                criteria: 'desc'
            }
        });

        const results = searchResult.results || [];
        console.log(`Debug: Total matches found: ${searchResult.paging?.total || 0}`);
        console.log(`Debug: Fetched ${results.length} results.`);
        results.forEach((p: any) => console.log(` - Payment ${p.id}: ${p.status} ($${p.transaction_amount})`));

        const approvedPayments = results.filter((p: any) => p.status === 'approved');
        console.log(`Found ${approvedPayments.length} approved payments.`);

        for (const p of approvedPayments) {
            const paymentId = p.id!.toString();
            const amount = p.transaction_amount || 0;
            const email = p.payer?.email;

            // Metadata keys are usually lowercased by MP
            const metadata = p.metadata || {};
            let userId = metadata.user_id;
            let courseId = metadata.course_id;

            // Check if purchase exists
            const exists = await prisma.purchase.findFirst({
                where: { paymentId: paymentId }
            });

            if (exists) {
                console.log(`[SKIP] Payment ${paymentId} already recorded for user ${exists.userId}.`);
                continue;
            }

            console.log(`[NEW] Payment ${paymentId} ($${amount}) by ${email} is MISSING.`);

            // RESOLVE USER
            if (!userId && email) {
                console.log(`   > Looking up user by email: ${email}`);
                const user = await prisma.user.findUnique({ where: { email } });
                if (user) {
                    userId = user.id;
                    console.log(`   > Found user: ${user.name} (${user.id})`);
                } else {
                    console.log(`   > User not found for email ${email}. Skipping.`);
                    continue;
                }
            }

            // RESOLVE COURSE
            if (!courseId) {
                // Try to guess from description or items
                const description = p.description || "";
                const title = p.additional_info?.items?.[0]?.title || description;

                console.log(`   > Looking up course by title: "${title}"`);
                const course = await prisma.course.findFirst({
                    where: {
                        title: { contains: title } // Removed mode: insensitive to fix lint
                    }
                });

                if (course) {
                    courseId = course.id;
                    console.log(`   > Found course: ${course.title} (${course.id})`);
                } else {
                    console.log(`   > Course not found for title "${title}". Skipping.`);
                    continue;
                }
            }

            if (userId && courseId) {
                const anyP = p as any; // Cast to access order property safely
                await prisma.purchase.create({
                    data: {
                        paymentId,
                        userId,
                        courseId,
                        amount,
                        status: 'approved',
                        preferenceId: anyP.order?.id?.toString() || "",
                    }
                });
                console.log(`   [SUCCESS] Recovered purchase for User ${userId} -> Course ${courseId}`);
            } else {
                console.log(`   [FAIL] Could not resolve User or Course. Metadata:`, metadata);
            }
        }

    } catch (error) {
        console.error("Error fetching payments:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
