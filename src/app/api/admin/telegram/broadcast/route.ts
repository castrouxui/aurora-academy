import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    // Auth check
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Get all verified telegram users
        const verifiedUsers = await prisma.user.findMany({
            where: {
                telegramVerified: true,
                telegram: { not: null }
            },
            select: {
                id: true,
                telegram: true,
                name: true
            }
        });

        if (verifiedUsers.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No hay usuarios verificados en Telegram."
            });
        }

        const results = await Promise.all(
            verifiedUsers.map(async (user) => {
                // user.telegram stores the chatId in this implementation
                const res = await sendTelegramMessage(user.telegram!, message);
                return {
                    userId: user.id,
                    success: res.success
                };
            })
        );

        const successful = results.filter(r => r.success).length;

        return NextResponse.json({
            success: true,
            total: verifiedUsers.length,
            sent: successful,
            failed: verifiedUsers.length - successful
        });

    } catch (error: any) {
        console.error("[TELEGRAM BROADCAST] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
