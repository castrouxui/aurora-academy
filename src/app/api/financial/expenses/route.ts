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

        let whereClause: any = {};

        if (startDateParam && endDateParam) {
            whereClause = {
                date: {
                    gte: new Date(startDateParam),
                    lte: new Date(endDateParam),
                },
            };
        } else {
            // Fallback to current month if no params
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            whereClause = {
                date: {
                    gte: start,
                    lte: end,
                }
            };
        }

        const expenses = await prisma.expense.findMany({
            where: whereClause,
            orderBy: {
                date: "desc",
            },
        });

        return NextResponse.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || (session.user.role !== "ADMIN" && !session.user.isCompanyAdmin)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { label, amount, date } = body;

        if (!label || !amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const expense = await prisma.expense.create({
            data: {
                label,
                amount: parseFloat(amount),
                date: date ? new Date(date) : new Date(),
            },
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error("Error creating expense:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
