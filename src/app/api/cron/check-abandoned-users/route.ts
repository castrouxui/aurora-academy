import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// This route should be called by Vercel Cron or an external job scheduler
// Recommended frequency: Every hour
export async function GET(req: Request) {
    try {
        // Calculate time range: Users created between 24h and 25h ago
        // This ensures we pick them up exactly once per day if the job runs hourly
        // Or if the job runs daily, adjust window to 24h-48h but mark them.
        // Better approach: Find users created < 48h ago who have NO purchases and NOT notified.
        // NOTE: We need a 'notified' flag or we rely on the window.
        // Let's rely on a window of 24h to 25h ago for simplicity since we don't have a 'notified' column yet.

        // Calculate previous calendar day (Yesterday 00:00 - 23:59)
        // Cron runs at 13:00 UTC (10:00 AM ARG) daily.
        // We want users who registered "yesterday".

        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
        const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999));

        const abandonedUsers = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: yesterdayStart,
                    lte: yesterdayEnd
                },
                purchases: {
                    none: {}
                },
                subscriptions: {
                    none: {}
                }
            },
            select: {
                email: true,
                name: true
            }
        });

        if (abandonedUsers.length === 0) {
            return NextResponse.json({ message: "No abandoned users found in window" });
        }

        console.log(`Found ${abandonedUsers.length} abandoned users. Sending emails...`);

        // Send emails
        const results = await Promise.allSettled(abandonedUsers.map(async (user) => {
            if (!user.email) return;

            const subject = "🎁 Tu futuro en el trading te espera";
            const html = `
                <h1 style="margin-top: 0; font-size: 24px; font-weight: bold;">¡No dejes pasar tu oportunidad!</h1>
                <p style="font-size: 16px; margin-bottom: 24px;">Hola <strong>${user.name?.split(' ')[0] || 'Trader'}</strong>,</p>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Notamos que te registraste en Aurora Academy pero aún no has desbloqueado todo tu potencial. Nuestra comunidad está logrando resultados increíbles, y queremos que seas parte de ella.</p>
                
                <div style="background-color: rgba(93, 92, 222, 0.05); border-left: 4px solid #5D5CDE; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #5D5CDE;">🚀 Accede hoy y obtén:</p>
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li>Cursos de nivel profesional</li>
                        <li>Certificación oficial</li>
                        <li>Mentoria en vivo</li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 32px;">
                    <a href="https://auroracademy.net/membresias" style="background-color: #5D5CDE; color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Ver Planes Disponibles
                    </a>
                </div>
            `;

            await sendEmail(user.email, subject, html, `Hola ${user.name || 'Trader'}, no pierdas la oportunidad de potenciar tu trading.`);
        }));

        const sentCount = results.filter(r => r.status === 'fulfilled').length;

        return NextResponse.json({ success: true, sent: sentCount });

    } catch (error) {
        console.error("Cron Error:", error);
        return new NextResponse("Internal Cron Error", { status: 500 });
    }
}
