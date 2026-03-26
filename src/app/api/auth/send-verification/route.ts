import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, renderEmailTemplate } from '@/lib/email';

// Rate limit: máx 3 envíos por email por hora
const rl = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(email: string): boolean {
    const now = Date.now();
    const entry = rl.get(email);
    if (!entry || entry.resetAt < now) {
        rl.set(email, { count: 1, resetAt: now + 3_600_000 });
        return true;
    }
    if (entry.count >= 3) return false;
    entry.count++;
    return true;
}

function hashOtp(otp: string, email: string): string {
    return crypto
        .createHmac('sha256', process.env.NEXTAUTH_SECRET || 'fallback-secret')
        .update(`${otp}:${email}`)
        .digest('hex');
}

export async function POST(req: NextRequest) {
    let email: string;
    try {
        const body = await req.json();
        email = body?.email?.toLowerCase().trim();
    } catch {
        return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
    }

    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });

    if (!checkRateLimit(email)) {
        return NextResponse.json({ error: 'Demasiados intentos. Esperá una hora e intentá de nuevo.' }, { status: 429 });
    }

    // Solo ejecutar para usuarios de Google sin contraseña
    // No revelar si el usuario existe o no (respuesta genérica)
    const user = await prisma.user.findUnique({
        where: { email },
        select: { password: true },
    });
    if (!user || user.password) {
        return NextResponse.json({ ok: true });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenHash = hashOtp(otp, email);
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // Limpiar tokens anteriores y crear uno nuevo
    await prisma.verificationToken.deleteMany({
        where: { identifier: `checkout-verify:${email}` },
    });
    await prisma.verificationToken.create({
        data: { identifier: `checkout-verify:${email}`, token: tokenHash, expires },
    });

    const html = renderEmailTemplate(
        `<h2 style="margin-top:0; color:#111827; font-size:22px;">Verificá tu identidad</h2>
         <p style="color:#4b5563; font-size:16px; line-height:1.6; margin-bottom:24px;">
             Para crear tu contraseña y completar tu compra, ingresá este código:
         </p>
         <div style="background:#f3f4f6; border-radius:12px; padding:24px; text-align:center; margin:0 0 24px;">
             <span style="font-size:44px; font-weight:900; letter-spacing:14px; color:#111827; font-family:monospace;">${otp}</span>
         </div>
         <p style="color:#6b7280; font-size:14px; margin:0;">Expira en 15 minutos. Si no fuiste vos, ignorá este email.</p>`,
        `Tu código de verificación: ${otp}`
    );

    await sendEmail(
        email,
        'Tu código de verificación — Aurora Academy',
        html,
        `Tu código de verificación es ${otp}`
    );

    return NextResponse.json({ ok: true });
}
