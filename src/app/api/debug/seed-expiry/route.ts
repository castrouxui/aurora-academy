import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// @ts-ignore
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const email = "expiry_demo@example.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create/Update User
        const user = await prisma.user.upsert({
            where: { email },
            update: { password: hashedPassword },
            create: {
                email,
                name: "Expiry Demo User",
                password: hashedPassword,
                role: "ESTUDIANTE"
            }
        });

        // 2. Ensure Bundle Exists
        const bundle = await prisma.bundle.upsert({
            where: { id: "seed-bundle-premium" },
            update: {},
            create: {
                title: "Membresía Premium (Demo)",
                description: "Pack completo para demostrar vencimientos.",
                price: 15000,
                published: true
            }
        });

        // 3. Create Subscription "Created 28 days ago" (So it renews in 2 days approx)
        const daysAgo = 28;
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - daysAgo);

        // Delete existing sub if any
        await prisma.subscription.deleteMany({ where: { userId: user.id } });

        await prisma.subscription.create({
            data: {
                userId: user.id,
                bundleId: bundle.id,
                mercadoPagoId: `demo_sub_${Date.now()}`,
                status: 'authorized',
                createdAt: pastDate,
                updatedAt: pastDate
            }
        });

        return NextResponse.json({
            message: "Seed successful",
            user: { email, password },
            info: "Subscription created 28 days ago. Should renew in ~2 days."
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
