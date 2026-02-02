import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { PreApproval, Preference } from "mercadopago";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { targetBundleId, targetPrice } = await req.json();

        // 1. Get current active subscription
        const currentSub = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                status: 'authorized'
            },
            include: { bundle: true }
        });

        if (!currentSub) {
            return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
        }

        // 2. Fetch MP Status to get next_payment_date
        const client = getMercadoPagoClient();
        const preApproval = new PreApproval(client);
        let subData: any = {};
        try {
            subData = await preApproval.get({ id: currentSub.mercadoPagoId });
        } catch (e) {
            console.warn("MP Get failed, checking for mock...");
            if (currentSub.mercadoPagoId.startsWith('PreApproval-Test')) {
                subData = { next_payment_date: null }; // Will be handled by next block
            } else {
                throw e;
            }
        }

        if (!subData.next_payment_date) {
            // MOCK FOR DEV: If ID is test, generate a fake next date
            if (currentSub.mercadoPagoId.startsWith('PreApproval-Test')) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 15); // 15 days remaining mock
                subData.next_payment_date = tomorrow.toISOString();
            } else {
                return NextResponse.json({ error: "Cannot determine next payment date" }, { status: 400 });
            }
        }

        const nextPayment = new Date(subData.next_payment_date);
        const now = new Date();

        // 3. Calculate remaining days
        const diffTime = Math.abs(nextPayment.getTime() - now.getTime());
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Cap at 30 days just in case
        const daysToCal = Math.min(daysRemaining, 30);

        // 4. Calculate Prorated Diff
        // Old Price vs New Price
        // We need to parse prices. Assuming input targetPrice is string "$100.000" or number
        const oldPrice = Number(currentSub.bundle.price);

        // Clean target price string if needed
        let newPrice = 0;
        if (typeof targetPrice === 'string') {
            newPrice = Number(targetPrice.replace(/[^0-9]/g, ''));
        } else {
            newPrice = Number(targetPrice);
        }

        if (newPrice <= oldPrice) {
            return NextResponse.json({ error: "Upgrade price must be higher" }, { status: 400 });
        }

        const priceDiff = newPrice - oldPrice;
        const dailyRate = priceDiff / 30; // Assuming 30 day cycle
        const proratedAmount = Math.ceil(dailyRate * daysToCal);

        // Minimum charge to avoid MP errors (e.g. 100 ARS)
        const finalAmount = Math.max(proratedAmount, 100);

        // 5. Create Preference for "Upgrade Fee"
        let preferenceId = "mock_pref_id";
        let initPoint = "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock";

        if (!currentSub.mercadoPagoId.startsWith('PreApproval-Test')) {
            const preference = new Preference(client);
            const pref = await preference.create({
                body: {
                    items: [
                        {
                            id: `UPGRADE-${currentSub.id}-${targetBundleId}`,
                            title: `Upgrade a ${targetBundleId} (Prorrateo)`,
                            quantity: 1,
                            unit_price: finalAmount,
                            currency_id: "ARS"
                        }
                    ],
                    metadata: {
                        type: "upgrade_fee",
                        user_id: session.user.id,
                        subscription_id: currentSub.id,
                        new_bundle_id: targetBundleId,
                        new_amount: newPrice, // The FULL new recurring price
                        old_bundle_id: currentSub.bundleId
                    },
                    back_urls: {
                        success: `${process.env.NEXTAUTH_URL}/dashboard/membresias?status=upgraded`,
                        failure: `${process.env.NEXTAUTH_URL}/dashboard/membresias?status=failure`,
                        pending: `${process.env.NEXTAUTH_URL}/dashboard/membresias?status=pending`
                    },
                    auto_return: "approved"
                }
            });
            preferenceId = pref.id!;
            initPoint = pref.init_point!;
        } else {
            // Return a link that redirects back to dashboard with success param to simulate payment?
            // Or just a dummy link.
            // Let's use a special localhost link that simulates the webhook?
            // For now just standard mock.
            initPoint = "#MOCK_PAYMENT_WINDOW";
        }

        return NextResponse.json({
            daysRemaining: daysToCal,
            priceDifference: priceDiff,
            proratedAmount: finalAmount,
            nextPaymentDate: nextPayment,
            preferenceId: preferenceId,
            initPoint: initPoint
        });

    } catch (error: any) {
        console.error("Upgrade calc error:", error);
        return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
    }
}
