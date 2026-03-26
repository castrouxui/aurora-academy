import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Rate limit: máx 5 intentos por email cada 15 min (frenar fuerza bruta)
const rl = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(email: string): boolean {
    const now = Date.now();
    const entry = rl.get(email);
    if (!entry || entry.resetAt < now) {
        rl.set(email, { count: 1, resetAt: now + 15 * 60_000 });
        return true;
    }
    if (entry.count >= 5) return false;
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
    let email: string, code: string;
    try {
        const body = await req.json();
        email = body?.email?.toLowerCase().trim();
        code = body?.code?.trim();
    } catch {
        return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
    }

    if (!email || !code) {
        return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    if (!checkRateLimit(email)) {
        return NextResponse.json({ error: 'Demasiados intentos. Esperá unos minutos.' }, { status: 429 });
    }

    const stored = await prisma.verificationToken.findFirst({
        where: {
            identifier: `checkout-verify:${email}`,
            expires: { gt: new Date() },
        },
    });

    if (!stored) {
        return NextResponse.json({ valid: false, error: 'El código expiró. Pedí uno nuevo.' });
    }

    const expectedHash = hashOtp(code, email);
    if (stored.token !== expectedHash) {
        return NextResponse.json({ valid: false, error: 'Código incorrecto. Revisá el email e intentá de nuevo.' });
    }

    // Código válido: eliminar el OTP y generar token de "verificado"
    await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: stored.identifier, token: stored.token } },
    });

    const verifiedToken = crypto.randomUUID();
    await prisma.verificationToken.deleteMany({
        where: { identifier: `checkout-verified:${email}` },
    });
    await prisma.verificationToken.create({
        data: {
            identifier: `checkout-verified:${email}`,
            token: verifiedToken,
            expires: new Date(Date.now() + 10 * 60 * 1000), // 10 min para completar el registro
        },
    });

    return NextResponse.json({ valid: true });
}
