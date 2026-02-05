import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { isEligibleForRefund } from "@/lib/refund";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ""
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { purchaseId } = await req.json();
        if (!purchaseId) {
            return NextResponse.json({ error: "Missing purchase ID" }, { status: 400 });
        }

        // Find the purchase
        const purchase = await prisma.purchase.findUnique({
            where: { id: purchaseId },
            include: { user: true }
        });

        if (!purchase) {
            return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
        }

        // Check if the purchase belongs to the logged-in user (or admin)
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (purchase.userId !== user?.id && user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check 24-hour refund eligibility
        if (!isEligibleForRefund(purchase.createdAt)) {
            return NextResponse.json({
                error: "La garantía de reembolso ha expirado (límite de 24 horas)."
            }, { status: 400 });
        }

        if (!purchase.paymentId) {
            return NextResponse.json({ error: "No payment ID found for this purchase" }, { status: 400 });
        }

        // Process refund in Mercado Pago
        const { PaymentRefund } = await import("mercadopago");
        const refund = new PaymentRefund(client);

        // Mercado Pago SDK v2 Refund
        const refundResult = await refund.create({
            payment_id: purchase.paymentId
        });

        if (refundResult.status === "approved" || refundResult.status === "refunded") {
            // Update DB status
            await prisma.purchase.update({
                where: { id: purchaseId },
                data: { status: "refunded" }
            });

            // If it was a bundle (subscription), we might want to cancel the subscription too
            if (purchase.bundleId) {
                const subscription = await prisma.subscription.findFirst({
                    where: {
                        userId: purchase.userId,
                        bundleId: purchase.bundleId,
                        status: "authorized"
                    }
                });

                if (subscription) {
                    // Logic to cancel subscription in MP and DB
                    const { cancelSubscription } = await import("@/lib/mercadopago");
                    await cancelSubscription(subscription.mercadoPagoId);

                    await prisma.subscription.update({
                        where: { id: subscription.id },
                        data: { status: "cancelled" }
                    });
                }
            }

            return NextResponse.json({
                success: true,
                message: "Reembolso procesado exitosamente"
            });
        }

        return NextResponse.json({
            error: "Mercado Pago rechazó el reembolso",
            details: refundResult
        }, { status: 500 });

    } catch (error: any) {
        console.error("[REFUND ERROR]", error);
        return NextResponse.json({
            error: "Error interno procesando el reembolso",
            details: error.message
        }, { status: 500 });
    }
}
