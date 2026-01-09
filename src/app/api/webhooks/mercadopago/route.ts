import { NextResponse } from "next/server";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        console.log(`[WEBHOOK] Received: topic=${topic}, id=${id}`);

        if (topic === "payment" && id) {
            const payment = new Payment(client);
            const paymentData = await payment.get({ id });

            console.log(`[WEBHOOK] Payment Status: ${paymentData.status}`);

            if (paymentData.status === "approved") {
                const { user_id, course_id } = paymentData.metadata;

                if (user_id && course_id) {
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
                            amount: paymentData.transaction_amount || 0,
                            status: 'approved',
                            paymentId: id,
                            preferenceId: "", // Optional or fetch if needed
                        }
                    });

                    console.log(`[WEBHOOK] Purchase saved for User ${user_id} Course ${course_id}`);
                }
            }
        }

        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error("[WEBHOOK ERROR]", error);
        return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
