import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "all";

    let startDate: Date | undefined;
    const now = new Date();

    if (period === "today") {
        startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === "week") {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        startDate = new Date(now.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
    } else if (period === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    try {
        const sales = await prisma.purchase.findMany({
            where: startDate ? {
                createdAt: {
                    gte: startDate
                }
            } : {},
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } },
                bundle: { select: { title: true } }
            }
        });

        // HARDCODE FIX: Correct amount for pablosonez@gmail.com
        const fixedSales = sales.map(s => {
            if (s.user.email === 'pablosonez@gmail.com' && Number(s.amount) === 200000) {
                return { ...s, amount: '150000' };
            }
            return s;
        });

        // --- SUBSCRIPTION STATS ---
        const subscriptions = await prisma.subscription.findMany({
            where: startDate ? {
                updatedAt: { gte: startDate }
            } : {}
        });

        const totalSubs = subscriptions.length;
        const cancelledSubs = subscriptions.filter(s => s.status === 'cancelled').length;
        const activeSubs = subscriptions.filter(s => s.status === 'authorized').length;
        const churnRate = totalSubs > 0 ? (cancelledSubs / totalSubs) * 100 : 0;

        return NextResponse.json({
            sales: fixedSales,
            subscriptions: {
                total: totalSubs,
                active: activeSubs,
                cancelled: cancelledSubs,
                churnRate: churnRate
            }
        });
    } catch (error) {
        console.error("[SALES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
