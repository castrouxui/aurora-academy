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

        // 1. Calculate Initial Balance (Everything before startDate)
        const previousRevenueAgg = await prisma.purchase.aggregate({
            _sum: { amount: true },
            where: {
                status: { in: ['approved', 'COMPLETED', 'paid'] },
                createdAt: { lt: dateFilter.gte }, // Before start date
            },
        });
        const previousRevenue = previousRevenueAgg._sum.amount ? parseFloat(previousRevenueAgg._sum.amount.toString()) : 0;

        const previousExpenseAgg = await prisma.expense.aggregate({
            _sum: { amount: true },
            where: {
                date: { lt: dateFilter.gte }, // Before start date
            },
        });
        const previousExpenses = previousExpenseAgg._sum.amount ? parseFloat(previousExpenseAgg._sum.amount.toString()) : 0;

        const initialBalance = previousRevenue - previousExpenses;

        // 2. Fetch Period Revenue
        const revenueAgg = await prisma.purchase.aggregate({
            _sum: { amount: true },
            where: {
                status: { in: ['approved', 'COMPLETED', 'paid'] },
                createdAt: dateFilter,
            },
        });
        const periodRevenue = revenueAgg._sum.amount ? parseFloat(revenueAgg._sum.amount.toString()) : 0;

        // 3. Fetch Period Expenses
        const expenseAgg = await prisma.expense.aggregate({
            _sum: { amount: true },
            where: {
                date: dateFilter,
            },
        });
        const periodExpenses = expenseAgg._sum.amount ? parseFloat(expenseAgg._sum.amount.toString()) : 0;

        // Calculate Metrics
        const netMargin = periodRevenue - periodExpenses; // Result of the period (P&L)
        const currentBalance = initialBalance + netMargin; // Actual Cash Position

        let roi = 0;
        if (periodExpenses > 0) {
            roi = ((periodRevenue - periodExpenses) / periodExpenses) * 100;
        } else if (periodRevenue > 0) {
            roi = 100;
        }

        return NextResponse.json({
            revenue: periodRevenue,
            expenses: periodExpenses,
            netMargin,
            roi,
            initialBalance,
            currentBalance,
        });

    } catch (error) {
        console.error("Error fetching financial summary:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
