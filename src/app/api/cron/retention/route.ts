import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// This endpoint matches users registered 24-25 hours ago who have NO purchases
// It is intended to be called by a CRON job every hour or 30 mins.
// Ideally protected by a secret query param, e.g. ?key=SECRET

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Calculate timestamp window: 24 to 25 hours ago
        const now = new Date();
        const startWindow = new Date(now.getTime() - 25 * 60 * 60 * 1000); // 25 hours ago
        const endWindow = new Date(now.getTime() - 24 * 60 * 60 * 1000);   // 24 hours ago

        console.log(`[RETENTION] Checking users between ${startWindow.toISOString()} and ${endWindow.toISOString()}`);

        const candidates = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: startWindow,
                    lte: endWindow
                },
                // We check purchases via relation filtering or manually
                purchases: {
                    none: {} // No purchases
                }
            },
            include: {
                purchases: true // Double check or use for template data
            }
        });

        console.log(`[RETENTION] Found ${candidates.length} candidates.`);

        let sentCount = 0;

        for (const user of candidates) {
            if (!user.email) continue;

            // Send Email
            const emailHtml = `
                <div style="text-align: center;">
                    <h1 style="color: #5D5CDE; font-size: 24px; font-weight: 800; margin-bottom: 10px;">¡Tu potencial te espera! 🚀</h1>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Hola ${user.name || 'Futuro Trader'},<br><br>
                        Notamos que te registraste en <strong>Aurora Academy</strong> pero aún no has dado el siguiente paso. 
                        Queremos recordarte que la educación es la mejor inversión que puedes hacer.
                    </p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #e5e7eb;">
                        <p style="font-weight: bold; margin-bottom: 10px;">¿Por qué empezar hoy?</p>
                        <ul style="text-align: left; margin: 0 auto; max-width: 300px; padding-left: 20px;">
                            <li>Acceso inmediato y de por vida ⚡</li>
                            <li>Comunidad de traders activa 👥</li>
                            <li>Certificación oficial 🎓</li>
                        </ul>
                    </div>

                    <a href="https://auroracademy.net/cursos" style="display: inline-block; background-color: #5D5CDE; color: white; padding: 15px 30px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px; margin-top: 20px;">
                        Explorar Cursos
                    </a>
                    
                    <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
                        Si tienes dudas, responde a este correo. Estamos para ayudarte.
                    </p>
                </div>
            `;

            const success = await sendEmail(
                user.email,
                "Tu futuro como trader empieza hoy 📈",
                emailHtml,
                "No dejes pasar tu oportunidad de aprender con los mejores."
            );

            if (success) {
                console.log(`[RETENTION] Email sent to ${user.email}`);
                sentCount++;
            }
        }

        return NextResponse.json({
            success: true,
            processed: candidates.length,
            sent: sentCount,
            window: { start: startWindow, end: endWindow }
        });

    } catch (error) {
        console.error("[RETENTION_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
