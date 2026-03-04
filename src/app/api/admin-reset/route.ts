import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    const adminResetKey = process.env.ADMIN_RESET_KEY;
    if (!adminResetKey || key !== adminResetKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!adminEmail || !adminPassword) {
        return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    try {
        const email = adminEmail;
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

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
        return NextResponse.json({ error: "Failed to reset admin" }, { status: 500 });
    }
}
