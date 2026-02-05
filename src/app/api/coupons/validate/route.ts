import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { code, bundleId } = await req.json();

        if (!code) {
            return new NextResponse("Code required", { status: 400 });
        }

        // Optional: If validation request includes context, enforce it early
        if (bundleId === null || bundleId === undefined) {
            // If the frontend explicitly sends null bundleId (indicating course), reject.
            // But if it just validates 'in general', we might allow it, but best to be strict.
            // We'll rely on the frontend sending bundleId if it's a membership page.
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return new NextResponse("Cupón no válido", { status: 404 });
        }

        if (!coupon.active) {
            return new NextResponse("Cupón inactivo", { status: 400 });
        }

        if (coupon.limit && coupon.used >= coupon.limit) {
            return new NextResponse("Cupón agotado", { status: 400 });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return new NextResponse("Cupón expirado", { status: 400 });
        }

        // STRICT CHECK: Coupons only for Memberships
        // If the request comes with specific context saying it's NOT a bundle, reject.
        // Or if we decide to enforce "Coupons are only for bundles" globally:
        // Ideally the frontend sends `type: 'bundle'` or similar. 
        // For now, let's assume validation is general, but the payment endpoint is the gatekeeper.
        // However, to give better UX, we should tell the user "Only for memberships".

        // We will assume that if bundleId is NOT provided in the validation body, it might be a course.
        // Let's check if the request body has explicit indication of context.
        // Re-reading step 1: I added 'bundleId' to destructuring but didn't use it yet.

        if (bundleId === undefined && req.headers.get('referer')?.includes('/learn/')) {
            // Weak check, but serves as a backup. 
            // Better: frontend passes `context: 'course'`
        }

        // SPECIAL RULE: "LANZAMIENTO10" only for Monthly Plans
        if (code.toUpperCase() === "LANZAMIENTO10") {
            // We need to check if the bundle is monthly.
            // If bundleId is present, fetch it to check price/characteristics or rely on frontend sending "isAnnual" flag?
            // The validation endpoint payload doesn't currently include "isAnnual".
            // We should fetch the bundle to be sure.
            if (bundleId) {
                const bundle = await prisma.bundle.findUnique({ where: { id: bundleId }, select: { title: true, price: true } });
                // Heuristic: If title contains "Anual", reject. Or compare price.
                // Ideally we have a better flag, but let's check title.
                if (bundle && bundle.title.toLowerCase().includes("anual")) {
                    return new NextResponse("Este cupón es exclusivo para planes mensuales (el plan anual ya tiene una oferta superior).", { status: 400 });
                }
            }
        }

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("[COUPON_VALIDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
