import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { generateOTP, sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { telegramHandle } = await req.json();
        if (!telegramHandle) return NextResponse.json({ error: "Telegram handle is required" }, { status: 400 });

        const otp = generateOTP();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP in VerificationToken table
        await prisma.verificationToken.upsert({
            where: { identifier_token: { identifier: session.user.email!, token: otp } },
            update: { expires },
            create: {
                identifier: session.user.email!,
                token: otp,
                expires
            }
        });

        // In a real scenario, we might need the user's chatId. 
        // For simple bots, we ask the user to send /start and then we can send them messages.
        // For now, we assume telegramHandle might be the chatId or we log it for the mock.
        const message = `🛡️ <b>Aurora Academy</b>\n\nTu código de verificación es: <code>${otp}</code>\n\nEste código expira en 10 minutos.`;

        const result = await sendTelegramMessage(telegramHandle, message);

        return NextResponse.json({
            success: true,
            mock: result.mock || false,
            message: result.mock ? "Código generado (Modo Mock)" : "Código enviado"
        });

    } catch (error: any) {
        console.error("Send OTP Error:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
