import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || (session.user.role !== "ADMIN" && !session.user.isCompanyAdmin)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await req.json();
        const { label, amount, date } = body;

        const expense = await prisma.expense.update({
            where: { id },
            data: {
                label,
                amount: amount !== undefined ? parseFloat(amount) : undefined,
                date: date ? new Date(date) : undefined,
            },
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error("Error updating expense:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || (session.user.role !== "ADMIN" && !session.user.isCompanyAdmin)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        await prisma.expense.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
