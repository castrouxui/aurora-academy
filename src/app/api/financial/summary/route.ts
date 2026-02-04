import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || (session.user.role !== "ADMIN" && !session.user.isCompanyAdmin)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        let dateFilter: any = {};

        if (startDateParam && endDateParam) {
            dateFilter = {
                gte: new Date(startDateParam),
                lte: new Date(endDateParam),
            };
        } else {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            dateFilter = {
                gte: start,
                lte: end,
            };
        }

        // Fetch Revenue (Purchases)
        const revenueAgg = await prisma.purchase.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: {
                    in: ['approved', 'COMPLETED', 'paid']
                },
                createdAt: dateFilter,
            },
        });

        const totalRevenue = revenueAgg._sum.amount ? parseFloat(revenueAgg._sum.amount.toString()) : 0;

        // Fetch Expenses
        const expenseAgg = await prisma.expense.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                date: dateFilter,
            },
        });

        const totalExpenses = expenseAgg._sum.amount ? parseFloat(expenseAgg._sum.amount.toString()) : 0;

        // Calculate Metrics
        const netMargin = totalRevenue - totalExpenses;

        let roi = 0;
        if (totalExpenses > 0) {
            roi = ((totalRevenue - totalExpenses) / totalExpenses) * 100;
        } else if (totalRevenue > 0) {
            roi = 100;
        }

        return NextResponse.json({
            revenue: totalRevenue,
            expenses: totalExpenses,
            netMargin,
            roi,
        });

    } catch (error) {
        console.error("Error fetching financial summary:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
