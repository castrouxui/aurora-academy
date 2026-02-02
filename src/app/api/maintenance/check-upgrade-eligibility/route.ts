
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Copied from src/constants/pricing.tsx to avoid import issues
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
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found", logs });
        }

        // 1. Determine Active Subscription
        const subscriptions = user.subscriptions;
        const activeSub = subscriptions.find(s => s.status === 'authorized') || subscriptions[0];

        if (!activeSub) {
            logs.push("No subscriptions found.");
            return NextResponse.json({ result: "NO_SUBSCRIPTION", logs });
        }

        logs.push(`Found Subscription: ${activeSub.id} (Status: ${activeSub.status})`);
        logs.push(`Bundle: ${activeSub.bundle.title} (ID: ${activeSub.bundleId})`);

        const bundleTitle = activeSub.bundle.title;

        // 2. Match with PLANS
        const planMatch = PLANS.find(p => p.title.toLowerCase() === bundleTitle.toLowerCase());

        if (!planMatch) {
            logs.push(`[CRITICAL] Bundle title '${bundleTitle}' does NOT match any known Plan title!`);
            logs.push(`Known titles: ${PLANS.map(p => p.title).join(", ")}`);
            logs.push("Upgrade logic WILL FAIL in frontend.");
        } else {
            logs.push(`[SUCCESS] Bundle title matches '${planMatch.title}'`);
            logs.push(`Current Price Value: ${planMatch.price}`);

            // 3. Simulate Upgrade Check
            const upgrades = [];
            for (const plan of PLANS) {
                if (plan.price > planMatch.price) {
                    upgrades.push(plan.title);
                }
            }
            logs.push(`Eligible Upgrades: ${upgrades.join(", ")}`);
            if (activeSub.status !== 'authorized') {
                logs.push("[WARNING] Subscription is NOT authorized. Frontend checks `subscription.active` which likely relies on this.");
            }
        }

        return NextResponse.json({
            user: { email: user.email, name: user.name },
            selectedSub: {
                id: activeSub.id,
                status: activeSub.status,
                bundle: activeSub.bundle.title,
                mercadoPagoId: activeSub.mercadoPagoId
            },
            allSubscriptions: subscriptions.map(s => ({
                id: s.id,
                title: s.bundle.title,
                status: s.status,
                createdAt: s.createdAt
            })),
            logs
        });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error", details: String(error) }, { status: 500 });
    }
}
