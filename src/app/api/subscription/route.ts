import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { PreApproval } from "mercadopago";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                status: { in: ['authorized', 'pending', 'paused'] }
            },
            include: { bundle: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!subscription) {
            return NextResponse.json({ active: false });
        }

        // Optional: Sync with MP if "pending" for too long? 
        // For now, trust the webhook flow, but return what we have.
        return NextResponse.json({
            active: true,
            subscription,
            bundleTitle: subscription.bundle.title
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

            return NextResponse.json({ success: true, message: "Subscription cancelled" });
        }

        return new NextResponse("Invalid action", { status: 400 });

    } catch (error: any) {
        console.error("Subscription Action Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update subscription" }, { status: 500 });
    }
}
