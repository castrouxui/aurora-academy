import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // Use the same secret key as Telegram for simplicity in this emergency
    if (secret !== "AURORA_ACTIVATE_2026") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        console.log("[DB-SYNC] Starting emergency schema sync...");

        // We use executeRawUnsafe to add columns if they are missing. 
        // This is a "self-healing" measure for when users can't run 'prisma db push' on Vercel easily.

        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT;`);
        console.log("[DB-SYNC] 'password' column checked/added.");

        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "telegram" TEXT;`);
        console.log("[DB-SYNC] 'telegram' column checked/added.");

        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "telegramVerified" BOOLEAN DEFAULT FALSE;`);
        console.log("[DB-SYNC] 'telegramVerified' column checked/added.");

        return NextResponse.json({
            success: true,
            message: "Base de datos sincronizada con los nuevos campos de Telegram y Password.",
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("[DB-SYNC] Error during sync:", error);
        return NextResponse.json({
            success: false,
            error: "Error al sincronizar la base de datos",
            details: error.message
        }, { status: 500 });
    }
}
