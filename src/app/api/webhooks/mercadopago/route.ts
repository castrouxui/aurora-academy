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
                            `<h1 style="margin-top: 0; margin-bottom: 24px; font-size: 24px;">¡Gracias por tu compra, ${user.name?.split(' ')[0] || ''}!</h1>
                             <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hemos recibido tu pago correctamente. Ya tenés acceso inmediato a todo tu contenido premium.</p>
                             <div style="text-align: center; margin-top: 32px;">
                                <a href="https://auroracademy.net/dashboard" style="background-color: #5D5CDE; color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Empezar a Aprender</a>
                             </div>`,
                            `Tu pago ha sido procesado con éxito.`
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

            // SELF-HEALING SUBSCRIPTION UPDATE (UPSERT)
            // If the record wasn't created during checkout (e.g. window closed too fast), 
            // the webhook will create it using metadata/external_reference.

            let userId = "";
            let bundleId = "";

            if (subscriptionData.external_reference) {
                try {
                    const ext = JSON.parse(subscriptionData.external_reference);
                    userId = ext.user_id;
                    bundleId = ext.bundle_id;
                } catch (e) {
                    console.error("[WEBHOOK] Failed to parse external_reference", e);
                }
            }

            const updated = await prisma.subscription.upsert({
                where: { mercadoPagoId: id },
                update: {
                    status: subscriptionData.status || 'pending',
                    updatedAt: new Date()
                },
                create: {
                    mercadoPagoId: id,
                    userId: userId,
                    bundleId: bundleId,
                    status: subscriptionData.status || 'pending',
                },
                include: { user: true, bundle: true }
            });

            // SEND CANCELLATION/APPROVAL EMAIL
            if (updated.user.email) {
                if (subscriptionData.status === 'cancelled') {
                    await sendEmail(
                        updated.user.email,
                        "Suscripción Cancelada - Aurora Academy",
                        `<h2 style="margin-top: 0; margin-bottom: 24px; font-size: 22px;">Confirmación de Cancelación</h2>
                         <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hola <strong>${updated.user.name || ''}</strong>,</p>
                         <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Confirmamos que tu suscripción al plan <strong>${updated.bundle.title}</strong> ha sido cancelada satisfactoriamente.</p>
                         <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Seguirás teniendo acceso hasta el final del período actual facturado.</p>
                         <p style="font-size: 14px; opacity: 0.8;">¡Esperamos verte de nuevo muy pronto!</p>`,
                        `Tu suscripción ha sido cancelada.`
                    );
                } else if (subscriptionData.status === 'authorized') {
                    // 1. WELCOME EMAIL
                    await sendEmail(
                        updated.user.email,
                        `¡Bienvenido al Plan ${updated.bundle.title}! - Aurora Academy`,
                        `<h1 style="margin-top: 0; margin-bottom: 24px; font-size: 24px;">¡Suscripción Activada! ✨</h1>
                         <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hola <strong>${updated.user.name || ''}</strong>,</p>
                         <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Tu suscripción al plan <strong>${updated.bundle.title}</strong> ya está activa.</p>
                         <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">Ahora tenés acceso ilimitado a todos los cursos, mentorías y beneficios de tu plan.</p>
                         <div style="text-align: center;">
                            <a href="https://auroracademy.net/dashboard" style="background-color: #5D5CDE; color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Acceder a mi Panel</a>
                         </div>`,
                        `¡Bienvenido a Aurora Academy! Tu suscripción ya está activa.`
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
