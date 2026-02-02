import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const preferenceId = searchParams.get('preferenceId');

        if (!preferenceId) {
            return NextResponse.json({ error: 'Missing preferenceId' }, { status: 400 });
        }

        // Check if a purchase exists with this preferenceId
        const purchase = await prisma.purchase.findFirst({
            where: {
                preferenceId: preferenceId,
                status: 'approved'
            }
        });

        if (purchase) {
            return NextResponse.json({ status: 'approved', purchaseId: purchase.id });
        }

        // Search by userId and courseId if provided (more reliable than preferenceId for webhook sync)
        // Search by userId and courseId/bundleId if provided (more reliable than preferenceId for webhook sync)
        const userId = searchParams.get('userId');
        const courseId = searchParams.get('courseId');
        const bundleId = searchParams.get('bundleId');

        if (userId && (courseId || bundleId)) {
            // 1. Check Purchases
            const whereClause: any = { userId, status: 'approved' };
            if (courseId) whereClause.courseId = courseId;
            if (bundleId) whereClause.bundleId = bundleId;

            const purchaseByContext = await prisma.purchase.findFirst({
                where: whereClause
            });
            if (purchaseByContext) {
                return NextResponse.json({ status: 'approved', purchaseId: purchaseByContext.id });
            }

            // 2. Check Subscriptions (if bundleId)
            if (bundleId) {
                const subscription = await prisma.subscription.findFirst({
                    where: {
                        userId,
                        bundleId,
                        status: 'authorized'
                    }
                });
                if (subscription) {
                    return NextResponse.json({ status: 'approved', subscriptionId: subscription.id });
                }
            }
        }

        // Fail-safe: Check MP API directly if we have any valid searchable ID
        if (preferenceId || (userId && (courseId || bundleId))) {
            try {
                if (!process.env.MP_ACCESS_TOKEN) {
                    console.warn("[FAILSAFE] Skipped: MP_ACCESS_TOKEN missing");
                    return NextResponse.json({ status: 'pending' });
                }
                const { MercadoPagoConfig, Payment } = await import('mercadopago');
                const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
                const paymentClient = new Payment(client);

                // Search for payments with this preference_id and status=approved
                // Using a date filter to optimize and avoid huge queries, though filtering by preference_id is usually enough.
                const searchResult = await paymentClient.search({
                    options: {
                        criteria: 'desc',
                        sort: 'date_created',
                        range: 'date_created',
                        begin_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                        filters: {
                            preference_id: preferenceId,
                            status: 'approved'
                        }
                    } as any // Bypass strict input types for search filters
                });

                if (searchResult.results && searchResult.results.length > 0) {
                    const approvedPayment = searchResult.results[0];
                    console.log(`[FAILSAFE] Found approved payment ${approvedPayment.id} for pref ${preferenceId}`);

                    // Create Purchase immediately
                    const finalUserId = userId || (approvedPayment as any).metadata?.user_id;
                    const finalCourseId = courseId || (approvedPayment as any).metadata?.course_id;
                    const finalBundleId = bundleId || (approvedPayment as any).metadata?.bundle_id;
                    const finalCouponId = (approvedPayment as any).metadata?.coupon_id;

                    if (!finalUserId) {
                        console.error("[FAILSAFE] Cannot create purchase: Missing userId");
                        return NextResponse.json({ status: 'pending' }); // Cannot credit to anyone
                    }

                    const newPurchase = await prisma.$transaction(async (tx) => {
                        const purchase = await tx.purchase.create({
                            data: {
                                userId: finalUserId,
                                courseId: finalCourseId,
                                bundleId: finalBundleId,
                                couponId: finalCouponId || undefined,
                                amount: approvedPayment.transaction_amount || 0,
                                status: 'approved',
                                paymentId: approvedPayment.id!.toString(),
                                preferenceId: preferenceId || (approvedPayment as any).preference_id || ""
                            }
                        });

                        if (finalCouponId) {
                            await tx.coupon.update({
                                where: { id: finalCouponId },
                                data: { used: { increment: 1 } }
                            });
                        }
                        return purchase;
                    });

                    return NextResponse.json({ status: 'approved', purchaseId: newPurchase.id });
                }

            } catch (err) {
                console.error("Fail-safe check error:", err);
            }
        }

        return NextResponse.json({ status: 'pending' });
    } catch (error) {
        console.error('Error checking payment status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
