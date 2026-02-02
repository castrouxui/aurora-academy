
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Copied from src/constants/pricing.tsx
const PLANS = [
    { title: "Inversor Inicial", price: 54900 },
    { title: "Trader de Elite", price: 89900 },
    { title: "Portfolio Manager", price: 149900 }
];

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!email) {
        return NextResponse.json({ error: "Email query param required" });
    }

    try {
        const logs: string[] = [];
        logs.push(`Checking user: ${email}`);

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                subscriptions: {
                    where: { status: { in: ['authorized', 'pending', 'paused', 'cancelled'] } },
                    include: { bundle: true },
                    orderBy: { createdAt: 'desc' }
                },
                purchases: {
                    where: { status: 'approved' },
                    include: { bundle: true, course: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found", logs });
        }

        // Active Sub Check
        const activeSub = user.subscriptions.find(s => s.status === 'authorized');

        // Bundle Matching
        if (activeSub) {
            const planMatch = PLANS.find(p => p.title.toLowerCase() === activeSub.bundle.title.toLowerCase());
            if (planMatch) {
                logs.push(`[SUCCESS] Active Sub matches '${planMatch.title}'`);
            } else {
                logs.push(`[CRITICAL] Active Sub '${activeSub.bundle.title}' NOT in Plans`);
            }
        } else {
            logs.push("[INFO] No Authorized Subscription found.");
        }

        return NextResponse.json({
            user: { email: user.email, name: user.name },
            activeSub: activeSub ? {
                id: activeSub.id,
                title: activeSub.bundle.title,
                status: activeSub.status
            } : null,
            allSubscriptions: user.subscriptions.map(s => ({
                id: s.id,
                title: s.bundle.title,
                status: s.status,
                createdAt: s.createdAt
            })),
            purchases: user.purchases.map(p => ({
                id: p.id,
                amount: p.amount,
                status: p.status,
                bundle: p.bundle?.title,
                bundleId: p.bundleId,
                course: p.course?.title,
                courseId: p.courseId,
                productName: p.productName,
                createdAt: p.createdAt
            })),
            logs
        });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error", details: String(error) }, { status: 500 });
    }
}
