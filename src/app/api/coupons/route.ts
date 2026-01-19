import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const values = await req.json();
        const { code, discount, expiresAt, limit } = values;

        if (!code || !discount) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(), // Ensure uppercase
                discount: parseFloat(discount),
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                limit: limit ? parseInt(limit) : null,
            }
        });

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("[COUPONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(coupons);
    } catch (error) {
        console.error("[COUPONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
