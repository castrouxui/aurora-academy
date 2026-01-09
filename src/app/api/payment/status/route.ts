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
        const userId = searchParams.get('userId');
        const courseId = searchParams.get('courseId');

        if (userId && courseId) {
            const purchaseByContext = await prisma.purchase.findFirst({
                where: {
                    userId: userId,
                    courseId: courseId,
                    status: 'approved'
                }
            });
            if (purchaseByContext) {
                return NextResponse.json({ status: 'approved', purchaseId: purchaseByContext.id });
            }
        }

        // Fail-safe: Check MP API directly if Preference ID is known but DB record is missing
        if (preferenceId && userId && courseId) {
            try {
                const { MercadoPagoConfig, Payment } = await import('mercadopago');
                const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
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
                    const newPurchase = await prisma.purchase.create({
                        data: {
                            userId: userId,
                            courseId: courseId,
                            amount: approvedPayment.transaction_amount || 0,
                            status: 'approved',
                            paymentId: approvedPayment.id!.toString(),
                            preferenceId: preferenceId
                        }
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
