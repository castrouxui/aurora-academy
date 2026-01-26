import { NextResponse } from "next/server";

import MercadoPagoConfig, { Payment, PreApproval } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { cancelSubscription } from "@/lib/mercadopago";

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


        if (topic === "payment" && id) {
            const client = getClient();
            const payment = new Payment(client);
            const paymentData = await payment.get({ id });


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

                    // SEND RECEIPT EMAIL
                    const user = await prisma.user.findUnique({ where: { id: user_id } });
                    if (user?.email) {
                        await sendEmail(
                            user.email,
                            "¡Pago Confirmado! - Aurora Academy",
                            `<h1>¡Gracias por tu compra, ${user.name || ''}!</h1>
                             <p>Hemos recibido tu pago correctamente. Ya tenés acceso inmediato a tu contenido.</p>
                             <p>Podés empezar a aprender ahora mismo en <a href="https://auroracademy.net/dashboard">Tu Panel</a>.</p>`
                        );
                    }

                    console.log(`[WEBHOOK] Purchase saved for User ${user_id} - ${bundle_id ? `Bundle ${bundle_id}` : `Course ${course_id}`}`);
                }
            }
        } else if ((topic === "preapproval" || topic === "subscription_preapproval") && id) {
            // SUBSCRIPTION STATUS UPDATE
            const client = getClient();
            const preApproval = new PreApproval(client);
            const subscriptionData = await preApproval.get({ id });

            console.log(`[WEBHOOK] Subscription ${id} Status: ${subscriptionData.status}`);

            // Update local DB status (authorized, paused, cancelled)
            const updated = await prisma.subscription.update({
                where: { mercadoPagoId: id },
                data: {
                    status: subscriptionData.status,
                    updatedAt: new Date()
                },
                include: { user: true, bundle: true }
            });

            // SEND CANCELLATION/APPROVAL EMAIL
            if (updated.user.email) {
                if (subscriptionData.status === 'cancelled') {
                    await sendEmail(
                        updated.user.email,
                        "Suscripción Cancelada - Aurora Academy",
                        `<p>Hola ${updated.user.name || ''},</p>
                         <p>Confirmamos que tu suscripción al plan <strong>${updated.bundle.title}</strong> ha sido cancelada.</p>
                         <p>Tendrás acceso hasta el final del período actual.</p>
                         <p>¡Esperamos verte pronto!</p>`
                    );
                } else if (subscriptionData.status === 'authorized') {
                    // 1. WELCOME EMAIL
                    await sendEmail(
                        updated.user.email,
                        `¡Bienvenido al Plan ${updated.bundle.title}! - Aurora Academy`,
                        `<h1>¡Suscripción Activada!</h1>
                         <p>Hola ${updated.user.name || ''},</p>
                         <p>Tu suscripción <strong>${updated.bundle.title}</strong> está activa.</p>
                         <p>Ahora tenés acceso ilimitado a todos los cursos y beneficios de tu plan.</p>
                         <p>Accedé ahora: <a href="https://auroracademy.net/dashboard">Ir a mi Panel</a></p>`
                    );

                    // 2. AUTO-CANCEL OLD SUBSCRIPTIONS (Upgrade/Downgrade Logic)
                    // Find all OTHER active/authorized subscriptions for this user
                    const previousSubs = await prisma.subscription.findMany({
                        where: {
                            userId: updated.userId,
                            status: 'authorized',
                            mercadoPagoId: { not: id } // Exclude current one
                        }
                    });

                    if (previousSubs.length > 0) {
                        console.log(`[WEBHOOK] Found ${previousSubs.length} old subscriptions to cancel for User ${updated.userId}`);

                        for (const oldSub of previousSubs) {
                            // A. Cancel in Mercado Pago
                            if (oldSub.mercadoPagoId) {
                                await cancelSubscription(oldSub.mercadoPagoId);
                            }

                            // B. Update in DB
                            await prisma.subscription.update({
                                where: { id: oldSub.id },
                                data: {
                                    status: 'cancelled',
                                    updatedAt: new Date()
                                }
                            });

                            console.log(`[WEBHOOK] Auto-cancelled old subscription ${oldSub.mercadoPagoId}`);
                        }
                    }
                }
            }

            console.log(`[WEBHOOK] Updated Subscription ${id} to ${subscriptionData.status}`);
        }

        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error("[WEBHOOK ERROR]", error);
        return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
