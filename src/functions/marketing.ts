
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://auroracademy.net";

/**
 * Helper to inject tracking pixel and wrap links
 */
async function sendTrackedEmail(
    user: { id: string; email: string; name?: string | null },
    subject: string,
    htmlContent: string,
    emailType: string, // CAMPAIGN_1, CAMPAIGN_2, etc.
    campaignId?: string
) {
    // 1. Create Log Entry
    const log = await prisma.emailLog.create({
        data: {
            userId: user.id,
            emailType,
            campaignId,
        },
    });

    // 2. Generate Tracking URLs
    const openPixelUrl = `${BASE_URL}/api/tracking/open?id=${log.id}`;

    // Replace all <a href="..."> with tracking links
    // Regex to find hrefs. Note: This is a simple regex, might need robustness for complex HTML
    const trackedHtml = htmlContent.replace(
        /href=["']([^"']+)["']/g,
        (match, url) => {
            if (url.startsWith("mailto:") || url.startsWith("#")) return match;
            const trackingUrl = `${BASE_URL}/api/tracking/click?id=${log.id}&url=${encodeURIComponent(url)}`;
            return `href="${trackingUrl}"`;
        }
    );

    // 3. Append Open Pixel
    const finalHtml = `${trackedHtml}<img src="${openPixelUrl}" alt="" width="1" height="1" style="display:none;"/>`;

    // 4. Send
    return await sendEmail(user.email!, subject, finalHtml);
}

// Check if user is a paid member
async function isPaidMember(userId: string) {
    const activeSub = await prisma.subscription.findFirst({
        where: {
            userId,
            status: { in: ["authorized", "active"] }, // Add other statuses if needed
        },
    });

    // Also check for lifetime purchases if applicable, but requirement says "active membership"
    // If "etiqueta de pago" means any purchase, we might check purchases too.
    // "Exclusión: Usuarios con etiqueta de pago o membresía activa."
    // Let's assume ANY successful purchase counts as 'etiqueta de pago' for now to be safe, or just subscriptions.
    // The prompt says "etiqueta de pago o membresía activa". I will check for any purchase or active sub.

    // Modificación solicitada: Incluir a usuarios que compraron cursos individuales (de pago o gratis).
    // El objetivo es convertirlos en suscriptores mensuales.
    // Por lo tanto, SOLO excluimos a los que ya tienen una suscripción activa.

    /* 
    const hasPurchase = await prisma.purchase.findFirst({
        where: { userId, status: "approved" }
    });
    */

    return !!activeSub;
}

// --- FLOW 1: CAMPAIGN ÚNICA ---

export async function sendCampaignEmail1(targetEmail?: string) {
    // Audiencia: Todos los registrados. Exclusión: Pagos/Membresía.
    const whereClause: any = {
        email: { not: null },
    };

    if (targetEmail) {
        whereClause.email = targetEmail;
    }

    const users = await prisma.user.findMany({
        where: whereClause
    });

    let sentCount = 0;
    const campaignId = "CAMPAIGN_FEB_2026"; // Unique ID for this blast

    for (const user of users) {
        // Exclude if paid
        if (await isPaidMember(user.id)) continue;

        // Exclude if already sent this specific email (idempotency)
        const existingLog = await prisma.emailLog.findFirst({
            where: {
                userId: user.id,
                emailType: "CAMPAIGN_1",
                campaignId
            }
        });
        if (existingLog) continue;

        // Content
        const html = `
            <p>Muchos se registran buscando una forma de profesionalizar su operativa, pero pocos dan el paso necesario para dominar una metodología real de mercado.</p>
            <p>A partir de este momento, habilitamos el beneficio de lanzamiento para nuestras Membresías Anuales en Aurora Academy. Tenés un 25% de descuento ya aplicado y la posibilidad de financiar cualquiera de nuestros planes anuales en 12 cuotas sin interés.</p>
            <p>Esto te permite acceder hoy mismo al programa completo, herramientas de análisis y el acompañamiento que elijas, dividiendo tu inversión en 12 pagos mensuales. Es la oportunidad para asegurar tu formación profesional por todo un año con el plan que mejor se adapte a vos.</p>
            <p style="text-align: center; margin: 25px 0;">
                <a href="https://auroracademy.net/membresias" class="button" style="background-color: #5D5CDE; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; mso-padding-alt: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%; box-sizing: border-box;">
                    <!--[if mso]><i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt">&nbsp;</i><![endif]-->
                    <span style="mso-text-raise: 15pt;">Ver planes anuales y beneficios</span>
                    <!--[if mso]><i style="letter-spacing: 25px; mso-font-width: -100%">&nbsp;</i><![endif]-->
                </a>
            </p>
            <p>Nos vemos adentro,<br><br>Fran Castro</p>
        `;

        await sendTrackedEmail(user as any, "Tu acceso exclusivo en 12 cuotas sin interés", html, "CAMPAIGN_1", campaignId);
        sentCount++;
    }

    return { sent: sentCount };
}

export async function sendCampaignEmail2(targetEmail?: string) {
    const campaignId = "CAMPAIGN_FEB_2026";

    // Find users who got Email 1
    const logsEmail1 = await prisma.emailLog.findMany({
        where: {
            emailType: "CAMPAIGN_1",
            campaignId,
            user: targetEmail ? { email: targetEmail } : undefined
        },
        include: { user: true }
    });

    let sentCount = 0;

    for (const log of logsEmail1) {
        const user = log.user;
        if (!user || !user.email) continue;

        // "El segundo mail se puede activar si la persona no compró nada ni pagó nada después del primer mail."
        if (await isPaidMember(user.id)) continue;

        // Check idempotency for Email 2
        const existingLog2 = await prisma.emailLog.findFirst({
            where: {
                userId: user.id,
                emailType: "CAMPAIGN_2",
                campaignId
            }
        });
        if (existingLog2) continue;

        const html = `
            <p>Noté que revisaste la plataforma pero todavía no confirmaste tu lugar en la Academia. Es normal dudar sobre qué nivel de compromiso tomar al elegir tu formación.</p>
            <p>La consistencia en el trading requiere estructura y un sistema probado. Por eso diseñamos diferentes Membresías Anuales: para que elijas el nivel de profundidad y acompañamiento que necesitás para madurar tu estrategia.</p>
            <p>Con el beneficio de lanzamiento, el costo anual de cualquiera de nuestros planes se divide en 12 cuotas sin interés. Esto te permite invertir en tu conocimiento de forma profesional, con pagos previsibles y un descuento del 25% ya incluido.</p>
            <p style="text-align: center; margin: 25px 0;">
                <a href="https://auroracademy.net/membresias" class="button" style="background-color: #5D5CDE; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; mso-padding-alt: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%; box-sizing: border-box;">
                    <!--[if mso]><i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt">&nbsp;</i><![endif]-->
                    <span style="mso-text-raise: 15pt;">Elegir mi membresía anual</span>
                    <!--[if mso]><i style="letter-spacing: 25px; mso-font-width: -100%">&nbsp;</i><![endif]-->
                </a>
            </p>
            <p>Un saludo,<br><br>Fran Castro</p>
        `;

        await sendTrackedEmail(user as any, "¿Cuál es tu plan para este año? (Leeme)", html, "CAMPAIGN_2", campaignId);
        sentCount++;
    }

    return { sent: sentCount };
}

export async function sendCampaignEmail3(targetEmail?: string) {
    const campaignId = "CAMPAIGN_FEB_2026";

    // Find users who got Email 1
    const logsEmail1 = await prisma.emailLog.findMany({
        where: {
            emailType: "CAMPAIGN_1",
            campaignId,
            user: targetEmail ? { email: targetEmail } : undefined
        },
        include: { user: true }
    });

    let sentCount = 0;

    for (const log of logsEmail1) {
        const user = log.user;
        if (!user || !user.email) continue;

        if (await isPaidMember(user.id)) continue;

        const existingLog3 = await prisma.emailLog.findFirst({
            where: {
                userId: user.id,
                emailType: "CAMPAIGN_3",
                campaignId
            }
        });
        if (existingLog3) continue;

        const html = `
            <p>Este es un aviso breve para informarte que mañana, 28 de febrero, finaliza la promoción de apertura de Aurora Academy.</p>
            <p>A partir de la medianoche, el precio con el 25% de descuento y la opción de pago en 12 cuotas sin interés en nuestras membresías anuales dejarán de estar disponibles.</p>
            <p>Si tu objetivo para este año es dominar una metodología de inversión sólida, esta es la ventana de tiempo para elegir tu plan anual con las mejores condiciones financieras posibles.</p>
            <p style="text-align: center; margin: 25px 0;">
                <a href="https://auroracademy.net/membresias" class="button" style="background-color: #5D5CDE; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; mso-padding-alt: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%; box-sizing: border-box;">
                    <!--[if mso]><i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt">&nbsp;</i><![endif]-->
                    <span style="mso-text-raise: 15pt;">Última oportunidad para acceder</span>
                    <!--[if mso]><i style="letter-spacing: 25px; mso-font-width: -100%">&nbsp;</i><![endif]-->
                </a>
            </p>
            <p>Te veo en el programa,<br><br>Fran Castro</p>
        `;

        await sendTrackedEmail(user as any, "Tu beneficio de lanzamiento vence mañana", html, "CAMPAIGN_3", campaignId);
        sentCount++;
    }

    return { sent: sentCount };
}

// --- FLOW 2: EVERGREEN ---

export async function runEvergreenWorkflow(targetEmail?: string) {
    const now = new Date();
    // Logic: 
    // Email 1: Registered 2 days ago (between 48h and 72h ago to be safe, or run hourly and check precise window)
    // Email 2: Sent Email 1 48h ago (between 48h and 72h) AND Did not buy.

    let email1Count = 0;
    let email2Count = 0;

    // --- EVERGREEN EMAIL 1 ---
    // Users created between 48h and 50h ago (assuming hourly cron). 
    // To be strictly robust, we check < 2 days ago? No, wait. "Esperar 2 días después del registro".

    // We'll look for users created > 48h ago who haven't received Email 1 yet.
    // And exclude users created > 7 days ago to avoid blasting old users who missed the cron.
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);

    const email1Query: any = {
        email: { not: null }
    };

    if (targetEmail) {
        email1Query.email = targetEmail;
        // If testing, we might want to ignore the date constraint to force send?
        // Or we assume the tester sets the user creation date correctly.
        // Let's assume date manipulation on the user.
    } else {
        email1Query.createdAt = {
            lt: twoDaysAgo,
            gt: threeDaysAgo // Safety window
        };
    }

    const newUsers = await prisma.user.findMany({
        where: email1Query
    });

    for (const user of newUsers) {
        if (await isPaidMember(user.id)) continue;

        // Check if already sent
        const sent1 = await prisma.emailLog.findFirst({
            where: { userId: user.id, emailType: "EVERGREEN_1" }
        });
        if (sent1) continue;

        // Prepare content (Shared header/body with nuances)
        // [Usar el mismo bloque de texto inicial del Email 1 del Flujo 1, pero cambiar los últimos párrafos]
        const html = `
            <p>La mayoría de las personas consumen información y no hacen nada. Acumulan teoría, miran los gráficos pasar y esperan el "momento perfecto".</p>
            <p>Pero el momento perfecto es una ilusión de los que no quieren tomar riesgos.</p>
            <p>En Aurora Academy no formamos espectadores, formamos protagonistas. Ya diste el primer paso y conocés las bases, pero la educación financiera sin ejecución es solo entretenimiento.</p>
            <p>Para dominar el mercado necesitás metodología institucional, estructura y estrategia. Es momento de elevar el estándar y tomar el control real de tu capital.</p>
            <p>Para los que están listos para dejar de observar, activamos un 25% OFF en nuestras membresías mensuales. Es válido únicamente durante tus primeras 48 horas en la plataforma. Tu código es: AURORA25</p>
            <p style="text-align: center; margin: 25px 0;">
                <a href="https://auroracademy.net/membresias" class="button" style="background-color: #5D5CDE; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; mso-padding-alt: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%; box-sizing: border-box;">
                    <!--[if mso]><i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt">&nbsp;</i><![endif]-->
                     <span style="mso-text-raise: 15pt;">Aprovechar mi beneficio de 48 horas.</span>
                    <!--[if mso]><i style="letter-spacing: 25px; mso-font-width: -100%">&nbsp;</i><![endif]-->
                </a>
            </p>
            <p>El mercado no espera a nadie. Nos vemos dentro,<br>Fran Castro</p>
        `;

        await sendTrackedEmail(user as any, "El costo de mirar desde afuera.", html, "EVERGREEN_1");
        email1Count++;
    }

    // --- EVERGREEN EMAIL 2 ---
    // Users who received EVERGREEN_1 > 48h ago
    const logsQuery: any = {
        emailType: "EVERGREEN_1",
    };

    if (targetEmail) {
        logsQuery.user = { email: targetEmail };
        // If testing, ignore time constraints? 
        // Better to respect them or user manually updates Log date. 
        // For simplicity in this "Actua como..." prompt, I'll respect dates unless I really need to force it.
        // Actually, for verification I'll want to force it.
    } else {
        logsQuery.sentAt = {
            lt: twoDaysAgo,
            gt: threeDaysAgo
        };
    }

    const logs1 = await prisma.emailLog.findMany({
        where: logsQuery,
        include: { user: true }
    });

    for (const log of logs1) {
        const user = log.user;
        if (!user || !user.email) continue;

        if (await isPaidMember(user.id)) continue;

        // Check if already sent Email 2
        const sent2 = await prisma.emailLog.findFirst({
            where: { userId: user.id, emailType: "EVERGREEN_2" }
        });
        if (sent2) continue;

        const html = `
            <p>Hace un par de días te activamos un beneficio para entrar a Aurora. Noté que todavía no lo usaste y tus 48 horas están por terminar.</p>
            <p>Casi siempre, cuando dudamos frente a una oportunidad no es por el precio. Es porque dudamos de si realmente vamos a aplicar lo que aprendemos. Preferimos la comodidad de seguir investigando gratis en lugar de comprometernos con un método.</p>
            <p>Pero la parálisis por análisis arruina más portafolios que las malas inversiones.</p>
            <p>En Aurora Academy diseñamos todo para eliminar el ruido. No te damos más horas de teoría interminable; te damos los sistemas exactos para que dejes de adivinar y empieces a ejecutar con confianza.</p>
            <p>Si estabas esperando una señal para dejar de postergarlo, es esta. Son tus últimas horas para usar el 25% OFF. Tu código es: AURORA25</p>
            <p style="text-align: center; margin: 25px 0;">
                <a href="https://auroracademy.net/membresias" class="button" style="background-color: #5D5CDE; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; mso-padding-alt: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 100%; box-sizing: border-box;">
                    <!--[if mso]><i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt">&nbsp;</i><![endif]-->
                    <span style="mso-text-raise: 15pt;">Asegurar mi lugar antes de que expire.</span>
                    <!--[if mso]><i style="letter-spacing: 25px; mso-font-width: -100%">&nbsp;</i><![endif]-->
                </a>
            </p>
            <p>El momento de construir es ahora. Nos vemos adentro,<br>Fran Castro</p> 
        `;

        await sendTrackedEmail(user as any, "El problema de pensarlo demasiado.", html, "EVERGREEN_2");
        email2Count++;

        // Final action: Assign tag
        // Note: tags is String[] on User
        const currentTags = user.tags || [];
        if (!currentTags.includes("Newsletter General")) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    tags: {
                        push: "Newsletter General"
                    }
                }
            });
        }
    }

    return { email1Sent: email1Count, email2Sent: email2Count };
}
