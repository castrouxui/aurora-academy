import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createHash } from "crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIP, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    // Rate limit: 5 OTP verification attempts per 5 minutes per IP
    const clientIP = getClientIP(req);
    const rateLimitKey = `otp-verify:${clientIP}:${session.user.id}`;
    if (!checkRateLimit(rateLimitKey, 5, 5 * 60 * 1000)) {
        return rateLimitResponse();
    }

    try {
        const { otp, telegramHandle } = await req.json();
        if (!otp) return NextResponse.json({ error: "OTP is required" }, { status: 400 });

        // Hash the incoming OTP and verify against stored hash
        const otpHash = createHash('sha256').update(otp).digest('hex');
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                identifier: session.user.email!,
                token: otpHash,
                expires: { gte: new Date() }
            }
        });

        if (!verificationToken) {
            return NextResponse.json({ error: "Código inválido o expirado" }, { status: 400 });
        }

        // Mark as verified
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                telegram: telegramHandle,
                telegramVerified: true
            } as any
        });

        // Clean up token
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: session.user.email!,
                    token: otpHash
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
    }
}
