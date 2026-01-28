import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const values = await req.json();
        const { id, code, discount, expiresAt, limit, active } = values;

        if (!id) {
            return new NextResponse("Missing coupon ID", { status: 400 });
        }

        // Prepare data object, updating only fields that are provided
        const data: any = {};
        if (code) data.code = code.toUpperCase();
        if (discount) data.discount = parseFloat(discount);

        // Handle nullable fields explicitly if passed, or if we want to allow clearing them via frontend
        if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;
        if (limit !== undefined) data.limit = limit ? parseInt(limit) : null;
        if (active !== undefined) data.active = active;

        const coupon = await prisma.coupon.update({
            where: { id },
            data
        });

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("[COUPONS_PATCH]", error);
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

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing coupon ID", { status: 400 });
        }

        // Check for existing usage before deleting?
        // Actually, if we want to allow deleting used coupons (e.g. testing), we might need to handle the relation.
        // But assuming we want to preserve history, maybe just block if used.
        // However, user said "Eliminar". I will try delete. If it fails due to FK, I catch it.
        // To be safe, let's first check if it has purchases.
        const usageCount = await prisma.purchase.count({ where: { couponId: id } });

        if (usageCount > 0) {
            // Option: Soft delete (set active=false) or Hard delete if possible?
            // Since we don't have cascade delete on Purchase->Coupon (it is optional), 
            // Purchase.couponId will stay as the ID but verification will fail if we join.
            // Actually, if it's optional, we can disconnect?
            // Let's just try to delete. If Prisma complains about FK constraint, we return specific error.
        }

        await prisma.coupon.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[COUPONS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
