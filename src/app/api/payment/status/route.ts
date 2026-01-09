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

        return NextResponse.json({ status: 'pending' });
    } catch (error) {
        console.error('Error checking payment status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
