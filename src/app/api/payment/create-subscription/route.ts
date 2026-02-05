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
        const { title, price, userId, email, couponCode, isAnnual } = body;
        let { bundleId } = body;
        let finalPrice = price;

        // Import Prisma needed for Bundle price check AND Coupon validation
        const { prisma } = await import("@/lib/prisma");

        if (bundleId) {
            const bundle = await prisma.bundle.findUnique({
                where: { id: bundleId }
            });
            if (bundle) {
                // @ts-ignore
                const basePrice = Number(bundle.price);
                finalPrice = isAnnual ? basePrice * 12 * 0.75 : basePrice;
            }
        } else if (title) {
            // Fallback: Find bundle by title
            const bundle = await prisma.bundle.findFirst({
                where: { title: title }
            });
            if (bundle) {
                // @ts-ignore
                bundleId = bundle.id; // Update variable to be used in metadata
                // @ts-ignore
                const basePrice = Number(bundle.price);
                finalPrice = isAnnual ? basePrice * 12 * 0.75 : basePrice;
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
        let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        if (!baseUrl) {
            const host = req.headers.get("host");
            const protocol = host?.includes("localhost") ? "http" : "https";
            baseUrl = host ? `${protocol}://${host}` : "https://auroracademy.net";
        }

        // Mercado Pago Subscription requires valid HTTPS URL, localhost is often rejected for back_url
        if (baseUrl.includes("localhost")) {
            baseUrl = "https://auroracademy.net"; // Fallback for dev to allow creation
        }

        const preApproval = new PreApproval(client);

        const subscriptionBody = {
            reason: title || "Suscripción Aurora Academy",
            auto_recurring: {
                frequency: isAnnual ? 12 : 1,
                frequency_type: 'months',
                transaction_amount: numericPrice,
                currency_id: 'ARS',
            },
            back_url: `${baseUrl}/dashboard/membresias`,
            payer_email: email, // Now using the explicit MP email provided by user
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

        // SAVE TO DB (Vital for logic)
        if (result.id) {
            await prisma.subscription.create({
                data: {
                    userId: userId,
                    bundleId: bundleId,
                    mercadoPagoId: result.id,
                    status: 'pending' // waits for webhook 'authorized'
                }
            });
            console.log(`[SUBSCRIPTION] Saved pending subscription ${result.id} for user ${userId}`);
        }

        return NextResponse.json({
            id: result.id,
            init_point: result.init_point
        });
    } catch (error: any) {
        console.error('Error creating subscription:', error);
        return NextResponse.json({ error: 'Error creating subscription', details: error.message || error }, { status: 500 });
    }
}
