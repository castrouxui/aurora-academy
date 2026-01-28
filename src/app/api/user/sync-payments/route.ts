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
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const payment = new Payment(client);
        const preApproval = new PreApproval(client);
        const email = session.user.email;
        const userId = session.user.id;

        let syncCount = 0;
        const results = {
            purchases: 0,
            subscriptions: 0
        };

        // 1. SYNC ONE-TIME PAYMENTS (Purchases)
        try {
            const paymentSearch = await payment.search({
                options: {
                    limit: 30,
                    // Use simpler filters to avoid SDK sorting bugs
                    sort: 'date_created',
                    criteria: 'desc'
                }
            });

            const myPayments = (paymentSearch.results || []).filter((p: any) =>
                p.id &&
                p.status === 'approved' &&
                (p.payer?.email === email || p.metadata?.user_id === userId)
            );

            for (const p of myPayments) {
                const paymentId = String(p.id);
                const exists = await prisma.purchase.findFirst({
                    where: { paymentId: paymentId }
                });

                if (!exists) {
                    const metadata = p.metadata || {};
                    let courseId = metadata.course_id;
                    let bundleId = metadata.bundle_id;

                    if (!courseId && !bundleId) {
                        const title = p.description || p.additional_info?.items?.[0]?.title || "";
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
                                amount: p.transaction_amount || 0,
                                status: 'approved',
                                preferenceId: anyP.order?.id?.toString() || ""
                            }
                        });
                        results.purchases++;
                        syncCount++;
                    }
                }
            }
        } catch (pError) {
            console.error("[SYNC] Payment search failed:", pError);
            // Don't crash the whole route, move to subscriptions
        }

        // 2. SYNC SUBSCRIPTIONS (PreApprovals)
        try {
            const subSearch = await preApproval.search({
                options: {
                    limit: 30,
                    sort: 'date_created',
                    criteria: 'desc'
                }
            });

            const mySubs = (subSearch.results || []).filter((s: any) =>
                s.id &&
                (s.payer_email === email || (typeof s.external_reference === 'string' && s.external_reference.includes(userId))) &&
                ['authorized', 'pending', 'paused', 'cancelled'].includes(s.status)
            );

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
                        const reason = s.reason || "";
                        const bundle = await prisma.bundle.findFirst({ where: { title: { contains: reason, mode: 'insensitive' } } });
                        if (bundle) bundleId = bundle.id;
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
                    }
                } else if (exists.status !== s.status && s.status) {
                    await prisma.subscription.update({
                        where: { id: exists.id },
                        data: { status: s.status, updatedAt: new Date() }
                    });
                    syncCount++;
                }
            }
        } catch (sError) {
            console.error("[SYNC] Subscription search failed:", sError);
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
