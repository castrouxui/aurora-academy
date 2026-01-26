import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    // Simple protection to prevent public abuse
    if (key !== "aurora-admin-fix-2026") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const email = "admin@aurora.com";
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // Upsert ensures it works even if user doesn't exist
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: "ADMIN"
            },
            create: {
                email,
                name: "Admin Aurora",
                password: hashedPassword,
                role: "ADMIN",
                image: `https://ui-avatars.com/api/?name=Admin+Aurora&background=random`
            }
        });

        return NextResponse.json({
            success: true,
            message: "Admin account reset successfully.",
            user: { email: user.email, role: user.role }
        });
    } catch (error) {
        console.error("Reset error:", error);
        return NextResponse.json({
            error: "Failed to reset admin",
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
