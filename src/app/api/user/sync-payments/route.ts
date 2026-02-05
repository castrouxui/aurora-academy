import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MercadoPagoConfig, Payment, PreApproval } from 'mercadopago';
import { prisma } from "@/lib/prisma";

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
        return NextResponse.json({ error: "MP_ACCESS_TOKEN is missing" }, { status: 500 });
    }

    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN.trim().replace(/^Bearer\s+/i, '') });
        const payment = new Payment(client);
        const preApproval = new PreApproval(client);
        const email = session.user.email.toLowerCase().trim();
        const userId = session.user.id;

        console.log(`[SYNC] Starting sync for user: ${email} (${userId})`);

        let syncCount = 0;
        const results = {
            purchases: 0,
            subscriptions: 0
        };

        // 1. SYNC ONE-TIME PAYMENTS (Purchases)
        try {
            // Strategy: Get recent 50 payments globally
            // Note: Use simple options to minimize API errors
            const paymentSearch = await payment.search({
                options: {
                    limit: 50,
                    sort: 'date_created',
                    criteria: 'desc'
                }
            });

            const myPayments = (paymentSearch.results || []).filter((p: any) =>
                p.id &&
                p.status === 'approved' &&
                (
                    (p.payer?.email && p.payer.email.toLowerCase().trim() === email) ||
                    (p.metadata?.user_id === userId)
                )
            );

            console.log(`[SYNC] Found ${myPayments.length} matching payments in recent list.`);

            for (const p of myPayments) {
                const paymentId = String(p.id);
                const exists = await prisma.purchase.findFirst({
                    where: { paymentId: paymentId }
                });

                if (!exists) {
                    const metadata = p.metadata || {};
                    let courseId = metadata.course_id;
                    let bundleId = metadata.bundle_id;

                    // Fallback: Try to match by Title if metadata is missing (manual payment)
                    const title = p.description || p.additional_info?.items?.[0]?.title || "";

                    if (!courseId && !bundleId) {
                        if (title) {
                            const course = await prisma.course.findFirst({ where: { title: { contains: title, mode: 'insensitive' } } });
                            if (course) courseId = course.id;
                            else {
                                const bundle = await prisma.bundle.findFirst({ where: { title: { contains: title, mode: 'insensitive' } } });
                                if (bundle) bundleId = bundle.id;
                            }
                        }
                    }

                    if (courseId || bundleId) {
                        const anyP = p as any;
                        await prisma.purchase.create({
                            data: {
                                paymentId: paymentId,
                                userId: userId,
                                courseId,
                                bundleId,
                                productName: title, // Save snapshot name
                                amount: p.transaction_amount || 0,
                                status: 'approved',
                                preferenceId: anyP.order?.id?.toString() || ""
                            }
                        });
                        results.purchases++;
                        syncCount++;
                        console.log(`[SYNC] Synced Purchase ${paymentId}`);
                    }
                } else {
                    // REPAIR: If purchase exists but has NO relations (due to deleted bundle), try to relink
                    if (!exists.bundleId && !exists.courseId) {
                        const title = p.description || p.additional_info?.items?.[0]?.title || "";
                        if (title) {
                            const bundle = await prisma.bundle.findFirst({ where: { title: { contains: title, mode: 'insensitive' } } });
                            if (bundle) {
                                await prisma.purchase.update({
                                    where: { id: exists.id },
                                    data: { bundleId: bundle.id, productName: title }
                                });
                                console.log(`[SYNC] Repaired Purchase ${exists.id} linking to Bundle ${bundle.title}`);
                                syncCount++; // Count as activity so toast shows success
                            }
                        }
                    }
                }
            }
        } catch (pError) {
            console.error("[SYNC] Payment search failed:", pError);
        }

        // 2. SYNC SUBSCRIPTIONS (PreApprovals)
        try {
            // Search Strategy 1: Search by Payer Email explicitly (if API supports it)
            let subResults: any[] = [];

            try {
                const emailSearch = await preApproval.search({
                    options: {
                        limit: 30,
                        payer_email: email
                    }
                });
                if (emailSearch.results && emailSearch.results.length > 0) {
                    subResults = [...subResults, ...emailSearch.results];
                }
            } catch (e) {
                console.warn("[SYNC] Email-specific sub search failed, falling back to global.");
            }

            // Search Strategy 2: Global Recent (in case email search failed or missed some)
            const globalSubSearch = await preApproval.search({
                options: {
                    limit: 50,
                    sort: 'date_created',
                    criteria: 'desc'
                }
            });

            if (globalSubSearch.results) {
                // De-duplicate based on ID
                const existingIds = new Set(subResults.map(s => s.id));
                globalSubSearch.results.forEach((s: any) => {
                    if (!existingIds.has(s.id)) {
                        subResults.push(s);
                    }
                });
            }

            const mySubs = subResults.filter((s: any) =>
                s.id &&
                (
                    (s.payer_email && s.payer_email.toLowerCase().trim() === email) ||
                    (typeof s.external_reference === 'string' && s.external_reference.includes(userId))
                ) &&
                ['authorized', 'pending', 'paused', 'cancelled'].includes(s.status)
            );

            console.log(`[SYNC] Found ${mySubs.length} matching subscriptions.`);

            for (const s of mySubs) {
                const subId = String(s.id);
                const exists = await prisma.subscription.findUnique({
                    where: { mercadoPagoId: subId }
                });

                if (!exists) {
                    let bundleId = "";
                    try {
                        const extStr = typeof s.external_reference === 'string' ? s.external_reference : "{}";
                        const ext = JSON.parse(extStr);
                        bundleId = ext.bundle_id;
                    } catch (e) {
                        // Fallback: Title match
                        const reason = s.reason || "";
                        if (reason) {
                            const bundle = await prisma.bundle.findFirst({ where: { title: { contains: reason, mode: 'insensitive' } } });
                            if (bundle) bundleId = bundle.id;
                        }
                    }

                    if (bundleId) {
                        await prisma.subscription.create({
                            data: {
                                mercadoPagoId: subId,
                                userId: userId,
                                bundleId,
                                status: s.status || 'pending'
                            }
                        });
                        results.subscriptions++;
                        syncCount++;
                        console.log(`[SYNC] Synced New Subscription ${subId}`);
                    } else {
                        console.log(`[SYNC] Found Sub ${subId} but could not match Bundle ID. Reason: ${s.reason}`);
                    }
                } else if (exists.status !== s.status && s.status) {
                    await prisma.subscription.update({
                        where: { id: exists.id },
                        data: { status: s.status, updatedAt: new Date() }
                    });
                    syncCount++;
                    console.log(`[SYNC] Updated Subscription ${subId} Status`);
                }
            }
        } catch (sError) {
            console.error("[SYNC] Subscription search failed:", sError);
        }

        // 3. LEGACY SUBSCRIPTION CHECK (For One-Time Bundle Purchases)
        try {
            // Find all Approved Bundle Purchases for this user
            const bundlePurchases = await prisma.purchase.findMany({
                where: {
                    userId: userId,
                    bundleId: { not: null },
                    status: 'approved'
                },
                include: { bundle: true }
            });

            for (const p of bundlePurchases) {
                // Check if Subscription exists
                const existingSub = await prisma.subscription.findFirst({
                    where: {
                        userId: userId,
                        bundleId: p.bundleId!,
                        status: 'authorized'
                    }
                });

                if (!existingSub) {
                    // Create Legacy Subscription
                    const newSub = await prisma.subscription.create({
                        data: {
                            userId: userId,
                            bundleId: p.bundleId!,
                            mercadoPagoId: `LEGACY-${p.paymentId || p.id}`,
                            status: 'authorized',
                            createdAt: p.createdAt, // Preserve original purchase date
                            updatedAt: new Date()
                        }
                    });
                    results.subscriptions++;
                    syncCount++;
                    console.log(`[SYNC] Auto-created Legacy Subscription for Purchase ${p.id}`);
                }
            }
        } catch (legacyError) {
            console.error("[SYNC] Legacy check failed:", legacyError);
        }

        return NextResponse.json({
            success: true,
            synced: syncCount,
            details: results
        });

    } catch (error: any) {
        console.error("Sync API Crash:", error);
        return NextResponse.json({
            error: "No se pudo conectar con MercadoPago. Intenta nuevamente en unos minutos."
        }, { status: 500 });
    }
}
