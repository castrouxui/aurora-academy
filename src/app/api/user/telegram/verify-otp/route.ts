import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { otp, telegramHandle } = await req.json();
        if (!otp) return NextResponse.json({ error: "OTP is required" }, { status: 400 });

        // Verify OTP
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                identifier: session.user.email!,
                token: otp,
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
                    token: otp
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
    }
}
