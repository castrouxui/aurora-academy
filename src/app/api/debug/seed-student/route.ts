import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Find the user (flexible search)
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: { contains: "student", mode: 'insensitive' } },
                    { email: { contains: "alumno", mode: 'insensitive' } },
                    { name: { contains: "student", mode: 'insensitive' } }
                ]
            }
        });

        if (!user) {
            return NextResponse.json({ error: "No se encontró ningún usuario 'student'" }, { status: 404 });
        }

        // 2. Find a bundle
        const bundle = await prisma.bundle.findFirst({
            where: { published: true }
        });

        if (!bundle) {
            return NextResponse.json({ error: "No hay membresías/bundles publicados para asignar" }, { status: 404 });
        }

        // 3. Create Subscription
        const sub = await prisma.subscription.create({
            data: {
                userId: user.id,
                bundleId: bundle.id,
                mercadoPagoId: `manual-seed-${Date.now()}`,
                status: 'authorized'
            }
        });

        return NextResponse.json({
            success: true,
            message: `Suscripción ACTIVADA para ${user.email} con el plan ${bundle.title}`,
            subscription: sub
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
