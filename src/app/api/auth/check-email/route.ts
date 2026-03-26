import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Rate limiter en memoria (se resetea al reiniciar el servidor)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function getClientIp(req: NextRequest): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || entry.resetAt < now) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}

export async function POST(req: NextRequest) {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: "Demasiadas solicitudes. Intentá de nuevo en un momento." }, { status: 429 });
    }

    let email: string;
    try {
        const body = await req.json();
        email = body?.email;
    } catch {
        return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
        return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: { id: true, password: true },
    });

    return NextResponse.json({
        exists: !!user,
        hasPassword: !!(user?.password),
    });
}
