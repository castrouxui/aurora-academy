import { MercadoPagoConfig, PreApproval } from 'mercadopago';
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
        const { title, price, userId, bundleId, email, couponCode } = body;
        let finalPrice = price;

        if (bundleId) {
            const { prisma } = await import("@/lib/prisma");
            const bundle = await prisma.bundle.findUnique({
                where: { id: bundleId }
            });
            if (bundle) {
                // Use server-side price
                // @ts-ignore
                finalPrice = Number(bundle.price);
            }
        }

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
        const origin = req.headers.get('origin');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (req.headers.get("origin") ?? "https://aurora-academy.onrender.com");

        const preApproval = new PreApproval(client);

        const subscriptionBody = {
            reason: title || "Suscripción Aurora Academy",
            auto_recurring: {
                frequency: 1,
                frequency_type: 'months',
                transaction_amount: numericPrice,
                currency_id: 'ARS',
            },
            back_url: `${baseUrl}/dashboard/memberships`,
            payer_email: email || "test_user_1234@testuser.com", // MP needs an email, ensuring one is passed or fallback
            status: "pending",
            external_reference: JSON.stringify({
                user_id: userId,
                bundle_id: bundleId,
                coupon_id: appliedCouponId
            })
        };

        console.log("Creating Subscription with body:", JSON.stringify(subscriptionBody, null, 2));

        const result = await preApproval.create({
            body: subscriptionBody
        });

        return NextResponse.json({
            id: result.id,
            init_point: result.init_point
        });
    } catch (error: any) {
        console.error('Error creating subscription:', error);
        return NextResponse.json({ error: 'Error creating subscription', details: error.message || error }, { status: 500 });
    }
}
