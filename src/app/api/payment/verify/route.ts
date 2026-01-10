import { NextResponse } from "next/server";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { paymentId } = await req.json();

        if (!paymentId) {
            return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
        }

        if (!process.env.MP_ACCESS_TOKEN) {
            console.error("MP_ACCESS_TOKEN is missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const payment = new Payment(client);

        const paymentData = await payment.get({ id: paymentId });

        console.log(`[VERIFY] Checking payment ${paymentId}. Status: ${paymentData.status}`);

        if (paymentData.status === "approved") {
            const { user_id, course_id } = paymentData.metadata;

            if (!user_id || !course_id) {
                return NextResponse.json({ error: "Invalid payment metadata" }, { status: 400 });
            }

            // Check if exists
            const existingPurchase = await prisma.purchase.findFirst({
                where: { paymentId: String(paymentId) }
            });

            if (existingPurchase) {
                console.log(`[VERIFY] Purchase already exists: ${existingPurchase.id}`);
                return NextResponse.json({
                    status: "success",
                    message: "Purchase already confirmed",
                    purchase: existingPurchase
                });
            }

            // Create Purchase
            const newPurchase = await prisma.purchase.create({
                data: {
                    userId: user_id,
                    courseId: course_id,
                    amount: paymentData.transaction_amount || 0,
                    status: 'approved',
                    paymentId: String(paymentId),
                    preferenceId: "",
                }
            });

            console.log(`[VERIFY] Created purchase: ${newPurchase.id}`);

            return NextResponse.json({
                status: "success",
                message: "Purchase created successfully",
                purchase: newPurchase
            });
        } else {
            return NextResponse.json({ error: "Payment not approved", status: paymentData.status }, { status: 400 });
        }

    } catch (error) {
        console.error("[VERIFY ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
