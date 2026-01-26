import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the client
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(req: NextRequest) {
    try {
        if (!process.env.MP_ACCESS_TOKEN) {
            console.error("Missing MP_ACCESS_TOKEN");
            return NextResponse.json({ error: "Server misconfiguration: Missing Payment Token" }, { status: 500 });
        }

        const body = await req.json();
        const { title, price, quantity, userId, courseId, bundleId, couponCode } = body;
        let finalPrice = price;

        const { prisma } = await import("@/lib/prisma");

        // 1. Resolve Base Price (Course or Bundle)
        let dbItem;
        if (!courseId && !bundleId && title) {
            // Fallback: Find course by title
            dbItem = await prisma.course.findFirst({
                where: { title: title }
            });
            if (dbItem) {
                // @ts-ignore
                finalPrice = Number(dbItem.price);
            }
        } else if (courseId) {
            const course = await prisma.course.findUnique({ where: { id: courseId } });
            if (course) {
                // @ts-ignore
                finalPrice = Number(course.price);
            }
        }

        if (bundleId) {
            const bundle = await prisma.bundle.findUnique({
                where: { id: bundleId }
            });
            if (bundle) {
                // Use server-side price
                // bundle.price is Decimal from Prisma, ensure we convert to number
                // @ts-ignore
                finalPrice = Number(bundle.price);
            }
        }

        // 2. Clean price string (ensure reference price is number)
        let numericPrice = typeof finalPrice === 'number' ? finalPrice : Number(String(finalPrice).replace(/[^0-9]/g, ''));

        // 3. Apply Coupon if provided
        let appliedCouponId = undefined;
        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode }
            });

            if (coupon && coupon.active) {
                // Check limits & expiry (Double check server side)
                const isExpired = coupon.expiresAt && new Date() > coupon.expiresAt;
                const isExhausted = coupon.limit && coupon.used >= coupon.limit;

                if (!isExpired && !isExhausted) {
                    appliedCouponId = coupon.id;
                    if (coupon.type === 'PERCENTAGE') {
                        // Discount is e.g. 20 for 20%
                        const discountAmount = numericPrice * (Number(coupon.discount) / 100);
                        numericPrice = numericPrice - discountAmount;
                    } else {
                        // Fixed amount discount
                        numericPrice = numericPrice - Number(coupon.discount);
                    }
                    // Ensure price doesn't go below 0
                    numericPrice = Math.max(0, numericPrice);
                }
            }
        }

        // Determine Base URL for callbacks
        // Priority: Env Var -> Request Origin -> Production Fallback -> Localhost
        const origin = req.headers.get('origin');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (req.headers.get("origin") ?? "https://auroracademy.net");

        const preference = new Preference(client);

        const preferenceBody = {
            items: [
                {
                    id: bundleId || courseId || 'unknown',
                    title: title,
                    unit_price: numericPrice,
                    quantity: 1,
                }
            ],
            back_urls: {
                success: `${baseUrl}/dashboard/courses`,
                failure: `${baseUrl}/pricing`,
                pending: `${baseUrl}/pricing`,
            },
            // auto_return removed to fix creation error
            metadata: {
                user_id: userId,
                course_id: courseId || (dbItem && !bundleId ? dbItem.id : undefined),
                bundle_id: bundleId,
                coupon_id: appliedCouponId,
            },
            notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        };

        const result = await preference.create({
            body: preferenceBody
        });

        return NextResponse.json({
            id: result.id,
            init_point: result.init_point
        });
    } catch (error: any) {
        console.error('Error creating preference:', error);
        return NextResponse.json({ error: 'Error creating preference', details: error.message || error }, { status: 500 });
    }
}
