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
                // We don't have a direct "get payment by preference" in SDK easily without searching.
                // But we can search for payments with this external_reference (if we set it) or just wait.
                // Actually, simplest fail-safe for MVP without heavy search is searching payments by criteria.

                // Better approach: Since we don't have the Payment ID here (only Preference ID),
                // we'll rely on the search API.

                const { MercadoPagoConfig, Payment } = await import('mercadopago');
                const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
                const payment = new Payment(client);

                // This is a "best effort" search if we assume the user just paid.
                // In reality, searching by preference_id in external_reference would be ideal if we set it.
                // For now, let's stick to the read-only or webhook reliance unless we revamp the flow to capture Payment ID on frontend.

                // WAIT. The frontend receives 'status=approved' & 'payment_id' in the URL query params upon redirect!
                // But this is a background poll. The poll doesn't know the Payment ID.

                // Pivot: Only the Webhook knows the Payment ID reliably for now.
                // Implementing a search here might be too heavy/risky for a quick fix without external_reference.
                // I will add a TODO to set external_reference = preferenceId in create-preference to make this searchable.

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
