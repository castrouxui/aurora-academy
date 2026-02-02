import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    // Only allow Admin or a specific secure secret
    // For now, checking for Admin Role
    if (!session?.user || session.user.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        console.log("[MAINTENANCE] Starting Legacy Subscription Fix...");

        // 1. Find all Approved Bundle Purchases
        const purchases = await prisma.purchase.findMany({
            where: {
                bundleId: { not: null },
                status: 'approved'
            },
            include: { user: true, bundle: true }
        });

        let fixedCount = 0;
        const results = [];

        for (const p of purchases) {
            // Check if Subscription exists
            const existingSub = await prisma.subscription.findFirst({
                where: {
                    userId: p.userId,
                    bundleId: p.bundleId!,
                    status: { in: ['authorized', 'pending', 'paused'] }
                }
            });

            if (!existingSub) {
                // MISSING SUBSCRIPTION FOUND
                console.log(`[MAINTENANCE] Fixing missing subscription for ${p.user.email} (Purchase ${p.id})`);

                const newSub = await prisma.subscription.create({
                    data: {
                        userId: p.userId,
                        bundleId: p.bundleId!,
                        mercadoPagoId: `LEGACY-${p.paymentId || p.id}`, // Mark as legacy
                        status: 'authorized',
                        createdAt: p.createdAt, // Preserve original date
                        updatedAt: new Date()
                    }
                });

                results.push({
                    email: p.user.email,
                    bundle: p.bundle.title,
                    action: "Created Subscription",
                    subId: newSub.id
                });
                fixedCount++;
            } else {
                // Exists, check if it matches expectations (optional)
            }
        }

        return NextResponse.json({
            success: true,
            message: `Fixed ${fixedCount} legacy subscriptions.`,
            details: results
        });

    } catch (error: any) {
        console.error("[MAINTENANCE] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
