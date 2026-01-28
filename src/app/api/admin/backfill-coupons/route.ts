import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.MP_ACCESS_TOKEN) {
            return NextResponse.json({ error: "Missing MP Token" }, { status: 500 });
        }

        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const paymentClient = new Payment(client);

        // 1. Get all purchases without coupon
        const purchases = await prisma.purchase.findMany({
            where: {
                couponId: null,
                status: 'approved'
            },
            take: 100 // Batch size safety
        });

        let updatedCount = 0;
        let logs: string[] = [];

        for (const purchase of purchases) {
            if (!purchase.paymentId) continue;

            try {
                // 2. Fetch details from Mercado Pago
                const mpPayment = await paymentClient.get({ id: purchase.paymentId });
                const meta = mpPayment.metadata;

                if (meta && meta.coupon_id) {
                    // found a missing coupon link!

                    // 3. Update DB
                    await prisma.$transaction(async (tx) => {
                        // Link coupon to purchase
                        await tx.purchase.update({
                            where: { id: purchase.id },
                            data: { couponId: meta.coupon_id }
                        });

                        // Increment used count
                        await tx.coupon.update({
                            where: { id: meta.coupon_id },
                            data: { used: { increment: 1 } }
                        });
                    });

                    updatedCount++;
                    logs.push(`Linked purchase ${purchase.id} to coupon ${meta.coupon_id}`);
                }
            } catch (err: any) {
                console.error(`Failed to check payment ${purchase.paymentId}`, err.message);
                logs.push(`Error checking ${purchase.paymentId}: ${err.message}`);
            }

            // tiny delay to avoid rate limits
            await new Promise(r => setTimeout(r, 100));
        }

        return NextResponse.json({
            success: true,
            updated: updatedCount,
            scanned: purchases.length,
            logs
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
