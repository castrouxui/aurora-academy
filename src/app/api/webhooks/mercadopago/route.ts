import { NextResponse } from "next/server";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

// Initialize client lazily to avoid build-time errors if env is missing
const getClient = () => {
    if (!process.env.MP_ACCESS_TOKEN) {
        throw new Error("MP_ACCESS_TOKEN is missing");
    }
    return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
};

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        console.log(`[WEBHOOK] Received: topic=${topic}, id=${id}`);

        if (topic === "payment" && id) {
            const client = getClient();
            const payment = new Payment(client);
            const paymentData = await payment.get({ id });

            console.log(`[WEBHOOK] Payment Status: ${paymentData.status}`);

            if (paymentData.status === "approved") {
                const { user_id, course_id, bundle_id } = paymentData.metadata;

                if (user_id && (course_id || bundle_id)) {
                    // Check if purchase already exists
                    const existingPurchase = await prisma.purchase.findFirst({
                        where: { paymentId: id }
                    });

                    if (existingPurchase) {
                        console.log(`[WEBHOOK] Purchase ${id} already exists`);
                        return NextResponse.json({ status: "success", message: "Already processed" });
                    }

                    await prisma.purchase.create({
                        data: {
                            userId: user_id,
                            courseId: course_id,
                            bundleId: bundle_id,
                            amount: paymentData.transaction_amount || 0,
                            status: 'approved',
                            paymentId: id,
                            preferenceId: "",
                        }
                    });

                    console.log(`[WEBHOOK] Purchase saved for User ${user_id} - ${bundle_id ? `Bundle ${bundle_id}` : `Course ${course_id}`}`);
                }
            }
        }

        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error("[WEBHOOK ERROR]", error);
        return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
