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
                    <h1>Hola ${sub.user.name || 'Estudiante'},</h1>
                    <p>Te recordamos que tu suscripción al plan <strong>${sub.bundle.title}</strong> se renovará automáticamente en los próximos días.</p>
                    <p>Si deseás continuar, no tenés que hacer nada.</p>
                    <p>Si necesitás gestionar tu suscripción, podés hacerlo desde tu <a href="https://auroracademy.net/dashboard/subscription">Panel de Control</a>.</p>
                    <br>
                    <p>Saludos,<br>El equipo de Aurora Academy</p>
                    `
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
