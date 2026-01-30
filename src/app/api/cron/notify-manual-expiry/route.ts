import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = req.headers.get('authorization');

        // Verify Cron Secret to prevent unauthorized access
        if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log(`[CRON] Running Manual Access Management`);

        // ==========================================
        // 1. NOTIFICATION LOGIC (Day 29)
        // ==========================================
        const today = new Date();
        const notificationDateStart = new Date(today);
        notificationDateStart.setDate(today.getDate() - 29); // 29 days ago (24h before expiry)
        notificationDateStart.setHours(0, 0, 0, 0);

        const notificationDateEnd = new Date(notificationDateStart);
        notificationDateEnd.setHours(23, 59, 59, 999);

        const usersToNotify = await prisma.purchase.findMany({
            where: {
                paymentId: { startsWith: 'manual_grant_' },
                status: 'approved',
                createdAt: {
                    gte: notificationDateStart,
                    lte: notificationDateEnd
                }
            },
            include: { user: { select: { name: true, email: true } } }
        });

        console.log(`[CRON] Found ${usersToNotify.length} users to notify`);

        for (const purchase of usersToNotify) {
            if (!purchase.user.email) continue;

            const expiryDate = new Date(purchase.createdAt);
            expiryDate.setDate(expiryDate.getDate() + 30);

            const emailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #5D5CDE; text-align: center;">Tu acceso está por finalizar</h2>
                    <p>Hola ${purchase.user.name || 'Estudiante'},</p>
                    <p>Esperamos que estés disfrutando de Aurora Academy.</p>
                    <p style="background-color: #FEF2F2; color: #991B1B; padding: 12px; border-radius: 8px; text-align: center; font-weight: bold;">
                        Te informamos que tu periodo de acceso manual finaliza en 24 horas (el ${expiryDate.toLocaleDateString('es-AR')}).
                    </p>
                    <p>Para evitar la interrupción de tu servicio y continuar aprendiendo sin cortes, por favor suscríbete ahora mismo a través de nuestra plataforma:</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="https://auroracademy.net/dashboard/membresias" style="background-color: #5D5CDE; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
                            Renovar Suscripción Ahora
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #666; text-align: center;">
                        Si no realizas la suscripción antes de la fecha límite, tu acceso se desactivará automáticamente.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
                    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                        Si ya te has suscrito recientemente, por favor desestima este mensaje.
                    </p>
                </div>
            `;

            // Enviar email con copia oculta al admin (usando la misma cuenta de envío si está disponible)
            const adminEmail = process.env.SMTP_EMAIL;

            await sendEmail(
                purchase.user.email,
                "⚠️ Importante: Tu acceso finaliza en 24 horas",
                emailHtml,
                "Renueva ahora para mantener tu acceso",
                adminEmail // BCC to admin
            );

            console.log(`[CRON] Notification sent to ${purchase.user.email}`);
        }

        // ==========================================
        // 2. EXPIRATION LOGIC (Day 30+)
        // ==========================================
        const expirationDateThreshold = new Date(today);
        expirationDateThreshold.setDate(today.getDate() - 30); // 30 days ago
        // We look for anything older than or equal to this date that is still approved

        const expiredPurchases = await prisma.purchase.updateMany({
            where: {
                paymentId: { startsWith: 'manual_grant_' },
                status: 'approved',
                createdAt: {
                    lt: expirationDateThreshold
                }
            },
            data: {
                status: 'cancelled'
            }
        });

        console.log(`[CRON] Expired ${expiredPurchases.count} users.`);

        return NextResponse.json({
            success: true,
            notified: usersToNotify.length,
            expired: expiredPurchases.count
        });

    } catch (error) {
        console.error("[CRON_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
