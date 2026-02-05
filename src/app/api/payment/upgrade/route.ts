import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { calculateSubscriptionMigration, isMigrationAllowed } from "@/lib/subscription-migration";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ""
});

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { subscriptionId, newBundleId } = await req.json();

        // 1. Get current subscription data
        const sub = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { bundle: true, user: true }
        });

        if (!sub) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        // 2. Get new bundle data
        const newBundle = await prisma.bundle.findUnique({
            where: { id: newBundleId }
        });

        if (!newBundle) {
            return NextResponse.json({ error: "New bundle not found" }, { status: 404 });
        }

        // 3. Calculate Migration Details
        const migration = calculateSubscriptionMigration({
            currentPlanPrice: Number(sub.bundle.price),
            newPlanPrice: Number(newBundle.price),
            startDate: sub.createdAt,
            isAnnual: true // Assuming annual for this logic as per user request
        });

        // 4. Validate Migration
        const allowed = isMigrationAllowed({
            isUpgrade: migration.isUpgrade,
            hasActiveInstallments: true // Conservative assumption for safety
        });

        if (!allowed) {
            return NextResponse.json({
                error: "El downgrade no está permitido para planes con cuotas activas."
            }, { status: 400 });
        }

        if (!migration.isUpgrade) {
            return NextResponse.json({
                error: "Detección de Downgrade: El downgrade solo es posible al renovar."
            }, { status: 400 });
        }

        // 5. Create Payment Preference for the Difference (Upgrade Fee)
        const preference = new Preference(client);

        let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!baseUrl) {
            const host = req.headers.get("host");
            const protocol = host?.includes("localhost") ? "http" : "https";
            baseUrl = host ? `${protocol}://${host}` : "https://auroracademy.net";
        }

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: `upgrade-${sub.id}`,
                        title: `Upgrade a ${newBundle.title} (Cargo Proporcional)`,
                        quantity: 1,
                        unit_price: migration.chargeAmount,
                        currency_id: 'ARS'
                    }
                ],
                metadata: {
                    type: 'upgrade_fee',
                    subscription_id: sub.id,
                    new_bundle_id: newBundle.id,
                    new_amount: Number(newBundle.price),
                    user_id: sub.userId
                },
                back_urls: {
                    success: `${baseUrl}/dashboard/membresias?status=upgrade_success`,
                    failure: `${baseUrl}/dashboard/membresias?status=upgrade_failed`
                },
                auto_return: "approved",
                external_reference: sub.id
            }
        });

        return NextResponse.json({
            id: result.id,
            init_point: result.init_point,
            migrationDetails: migration
        });

    } catch (error: any) {
        console.error("[UPGRADE ERROR]", error);
        return NextResponse.json({
            error: "Error interno procesando el upgrade",
            details: error.message
        }, { status: 500 });
    }
}
