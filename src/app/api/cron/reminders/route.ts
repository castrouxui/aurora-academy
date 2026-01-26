import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function GET(req: Request) {
    // Basic security: Check for a secret query param or just verify caller (Vercel Cron headers usually)
    // For MVP, we'll keep it open but obscure, or check a CRON_SECRET env if user wants.

    try {
        const today = new Date();
        // Look for subscriptions updated 25 to 28 days ago (assuming monthly)
        // This is a naive heuristic for "upcoming payment"
        const reminderStart = new Date();
        reminderStart.setDate(today.getDate() - 28);

        const reminderEnd = new Date();
        reminderEnd.setDate(today.getDate() - 25);

        const subscriptions = await prisma.subscription.findMany({
            where: {
                status: 'authorized',
                updatedAt: {
                    gte: reminderStart,
                    lte: reminderEnd
                }
            },
            include: { user: true, bundle: true }
        });

        console.log(`[CRON] Found ${subscriptions.length} subscriptions to remind.`);

        const results = [];

        for (const sub of subscriptions) {
            if (sub.user.email) {
                const sent = await sendEmail(
                    sub.user.email,
                    "Tu suscripción se renovará pronto - Aurora Academy",
                    `
                    <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 22px;">Hola <strong>${sub.user.name || 'Estudiante'}</strong>,</h2>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Te recordamos que tu suscripción al plan <strong>${sub.bundle.title}</strong> se renovará automáticamente en los próximos días.</p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Si deseás continuar aprendiendo con nosotros, no tenés que hacer nada. El cargo se procesará automáticamente.</p>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="https://auroracademy.net/dashboard/memberships" style="background-color: #5D5CDE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Gestionar mi Suscripción</a>
                    </div>
                    
                    <p style="font-size: 14px; margin-top: 40px; opacity: 0.8;">
                        Saludos,<br>
                        <strong>El equipo de Aurora Academy</strong>
                    </p>
                    `,
                    `Recordatorio de renovación automática para ${sub.bundle.title}.`
                );
                results.push({ email: sub.user.email, sent });
            }
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });

    } catch (error: any) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
