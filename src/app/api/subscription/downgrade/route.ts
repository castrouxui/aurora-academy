import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { PreApproval } from "mercadopago";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { targetBundleId, targetPrice } = await req.json();

        // 1. Get current subscription
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

        // 2. Parse New Price
        let newPrice = 0;
        if (typeof targetPrice === 'string') {
            newPrice = Number(targetPrice.replace(/[^0-9]/g, ''));
        } else {
            newPrice = Number(targetPrice);
        }

        // 3. Update PreApproval in MercadoPago
        if (!currentSub.mercadoPagoId.startsWith('PreApproval-Test')) {
            const client = getMercadoPagoClient();
            const preApproval = new PreApproval(client);

            await preApproval.update({
                id: currentSub.mercadoPagoId,
                body: {
                    auto_recurring: {
                        transaction_amount: newPrice,
                        currency_id: 'ARS'
                    }
                }
            });
        } else {
            console.log("Mock Downgrade: MP Update Skipped for Test ID");
        }

        // 4. Update Local DB
        // We switch the bundleId immediately effectively giving them the "lower" tier content? 
        // OR we should perhaps wait? 
        // Generally, for downgrades, standard practice is:
        // Option A: Keep high tier until end of cycle (Complex implementation requiring cron jobs).
        // Option B: Switch immediately (Easier, but user "loses" days they paid for).
        // Option C: Refund difference? (No).

        // Given complexity, we will switch the Bundle ID immediately in DB so UI updates.
        // But user pays less next month.

        const newBundle = await prisma.bundle.findUnique({ where: { id: targetBundleId } });
        if (!newBundle) throw new Error("Bundle not found");

        await prisma.subscription.update({
            where: { id: currentSub.id },
            data: {
                bundleId: targetBundleId
            }
        });

        // 5. Notify User
        if (session.user.email) {
            await sendEmail(
                session.user.email,
                "Cambio de Plan Confirmado - Aurora Academy",
                `<p>Hola <strong>${session.user.name}</strong>,</p>
                <p>Tu plan ha sido cambiado exitosamente a <strong>${newBundle.title}</strong>.</p>
                <p>El nuevo monto de <strong>$${newPrice}</strong> se aplicará a partir de tu próxima renovación.</p>`,
                "Tu plan ha sido actualizado."
            );
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Downgrade error:", error);
        return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
    }
}
