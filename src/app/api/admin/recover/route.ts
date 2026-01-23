import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from "@/lib/prisma";

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
        return NextResponse.json({ error: "MP_ACCESS_TOKEN is missing" }, { status: 500 });
    }

    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const payment = new Payment(client);

        console.log("Starting recovery process via API...");

        // 1. Fetch recent payments
        const searchResult = await payment.search({
            options: {
                limit: 100,
                offset: 0,
                sort: 'date_created',
                criteria: 'desc'
            }
        });

        const results = searchResult.results || [];
        const approvedPayments = results.filter((p: any) => p.status === 'approved');

        let recoveredCount = 0;
        const logs: string[] = [];

        for (const p of approvedPayments) {
            const paymentId = p.id!.toString();
            const amount = p.transaction_amount || 0;
            const email = p.payer?.email;
            const metadata = p.metadata || {};

            let userId = metadata.user_id;
            let courseId = metadata.course_id;

            // Check if purchase exists
            const exists = await prisma.purchase.findFirst({
                where: { paymentId: paymentId }
            });

            if (exists) {
                logs.push(`[SKIP] Payment ${paymentId} already recorded.`);
                continue;
            }

            // Resolve User
            if (!userId) {
                if (!email) {
                    logs.push(`[SKIP] No email/user_id for payment ${paymentId}`);
                    continue;
                }

                const user = await prisma.user.findUnique({ where: { email } });
                if (user) {
                    userId = user.id;
                } else {
                    const payer: any = p.payer || {};
                    const newUser = await prisma.user.create({
                        data: {
                            email: email,
                            name: payer.first_name ? `${payer.first_name} ${payer.last_name || ''}`.trim() : "Usuario Recuperado",
                            image: `https://ui-avatars.com/api/?name=${email}&background=random`
                        }
                    });
                    userId = newUser.id;
                    logs.push(`[NEW USER] Created user for ${email}`);
                }
            }

            // Resolve Course or Bundle
            if (!courseId && !metadata.bundle_id) {
                const description = p.description || "";
                const title = p.additional_info?.items?.[0]?.title || description;

                if (!title || title.trim() === "") {
                    logs.push(`[SKIP] No title for payment ${paymentId}`);
                    continue;
                }

                // Try Course
                const course = await prisma.course.findFirst({
                    where: { title: { contains: title, mode: 'insensitive' } }
                });

                if (course) {
                    courseId = course.id;
                } else {
                    // Try Bundle
                    const bundle = await prisma.bundle.findFirst({
                        where: { title: { contains: title, mode: 'insensitive' } }
                    });

                    if (bundle) {
                        metadata.bundle_id = bundle.id; // Correctly detecting usage
                    } else {
                        logs.push(`[SKIP] Item not found (Course/Bundle): "${title}"`);
                        continue;
                    }
                }
            }

            if (userId && (courseId || metadata.bundle_id)) {
                const anyP = p as any;
                await prisma.purchase.create({
                    data: {
                        paymentId,
                        userId,
                        courseId,
                        bundleId: metadata.bundle_id, // Add bundleId support
                        amount,
                        status: 'approved',
                        preferenceId: anyP.order?.id?.toString() || "",
                    }
                });
                recoveredCount++;
                logs.push(`[SUCCESS] Recovered purchase ${paymentId} ($${amount}) for ${email}`);
            }
        }

        return NextResponse.json({
            success: true,
            recovered: recoveredCount,
            logs
        });

    } catch (error: any) {
        console.error("Recovery API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
