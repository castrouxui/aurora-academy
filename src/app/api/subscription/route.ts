import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { PreApproval } from "mercadopago";
import { sendEmail } from "@/lib/email";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: session.user.id,
                status: { in: ['authorized', 'pending', 'paused', 'cancelled'] }
            },
            include: {
                bundle: {
                    include: {
                        items: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Current Logic: Prioritize 'authorized' subscriptions, otherwise take the most recent one.
        const subscription = subscriptions.find(s => s.status === 'authorized') || subscriptions[0];

        if (!subscription) {
            const allBundles = await prisma.bundle.findMany({
                where: { published: true },
                orderBy: { price: 'asc' }
            });
            return NextResponse.json({ active: false, otherBundles: allBundles });
        }

        // Check for LEGACY expiration (Self-Healing)
        if (subscription && subscription.mercadoPagoId && subscription.mercadoPagoId.startsWith('LEGACY-')) {
            const createdAt = new Date(subscription.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - createdAt.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 30) {
                console.log(`[SUBSCRIPTION] Legacy subscription ${subscription.id} expired (${diffDays} days). Auto-cancelling.`);
                // Update to cancelled
                await prisma.subscription.update({
                    where: { id: subscription.id },
                    data: { status: 'cancelled' }
                });
                // Recurse or just return inactive
                return NextResponse.json({ active: false, otherBundles: await prisma.bundle.findMany({ where: { published: true }, orderBy: { price: 'asc' } }) });
            }
        }

        const isActive = subscription.status === 'authorized';
        const otherBundles = await prisma.bundle.findMany({
            where: {
                published: true,
                id: { not: subscription.bundleId }
            },
            orderBy: { price: 'asc' }
        });

        return NextResponse.json({
            active: isActive,
            subscription,
            bundleTitle: subscription.bundle.title,
            otherBundles
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { action, subscriptionId } = await req.json();

        if (action === "cancel") {
            const subscription = await prisma.subscription.findUnique({
                where: { id: subscriptionId, userId: session.user.id }
            });

            if (!subscription) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

            // Cancel in Mercado Pago
            const client = getMercadoPagoClient();
            const preApproval = new PreApproval(client);

            await preApproval.update({
                id: subscription.mercadoPagoId,
                body: { status: "cancelled" }
            });

            // Update Local
            await prisma.subscription.update({
                where: { id: subscriptionId },
                data: { status: "cancelled" }
            });

            // SEND CANCELLATION EMAIL
            if (session.user.email) {
                await sendEmail(
                    session.user.email,
                    "Suscripción Cancelada - Aurora Academy",
                    `<p>Hola <strong>${session.user.name || ''}</strong>,</p>
                    <p>Confirmamos que tu suscripción ha sido cancelada exitosamente desde el panel de control.</p>
                    <p>Seguirás teniendo acceso completo hasta el final del período actual facturado.</p>`,
                    `Confirmación de cancelación de suscripción.`
                );
            }

            return NextResponse.json({ success: true, message: "Subscription cancelled" });
        }

        return new NextResponse("Invalid action", { status: 400 });

    } catch (error: any) {
        console.error("Subscription Action Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update subscription" }, { status: 500 });
    }
}
