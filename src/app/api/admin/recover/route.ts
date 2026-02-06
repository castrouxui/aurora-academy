import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN.trim() });
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

            // Verify if metadata userId exists in current DB
            if (userId) {
                const existingUser = await prisma.user.findUnique({ where: { id: userId } });
                if (!existingUser) {
                    console.log(`[WARN] Metadata userId ${userId} not found. Falling back to email.`);
                    userId = null; // Force fallback to email lookup
                }
            }

            // (Existence check moved down to allow updates)

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

            const description = p.description || "";
            const title = p.additional_info?.items?.[0]?.title || description;

            // Resolve Course or Bundle
            if (!courseId && !metadata.bundle_id) {

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

            // Verify Bundle/Course Existence (Crucial to avoid FK errors if item was deleted)
            let finalBundleId = metadata.bundle_id;
            let finalCourseId = courseId;

            if (finalBundleId) {
                const bundleExists = await prisma.bundle.findUnique({ where: { id: finalBundleId } });
                if (!bundleExists) {
                    logs.push(`[WARN] Bundle ID ${finalBundleId} from metadata not found in DB. Unlinking.`);
                    finalBundleId = null;
                }
            }

            if (finalCourseId) {
                const courseExists = await prisma.course.findUnique({ where: { id: finalCourseId } });
                if (!courseExists) {
                    logs.push(`[WARN] Course ID ${finalCourseId} not found in DB. Unlinking.`);
                    finalCourseId = null;
                }
            }

            // Determine Product Name (Snapshot)
            let snapTitle = "Ítem desconocido";
            if (finalBundleId) {
                // We checked existence above, so if finalBundleId is not null, it exists.
                // But we don't have the title variable handy unless we fetch it or trust metadata.
                // Let's rely on metadata/description which is usually correct from MP.
                snapTitle = description || title || "Bundle";
            } else if (finalCourseId) {
                snapTitle = description || title || "Curso";
            } else {
                // Fallback for unlinked items
                snapTitle = description || title || "Ítem eliminado";
            }

            // Check if purchase exists
            const existingPurchase = await prisma.purchase.findFirst({
                where: { paymentId: paymentId }
            });

            if (existingPurchase) {
                // IF existed but has no product name (legacy issue), update it!
                if (!existingPurchase.productName && snapTitle !== "Ítem desconocido") {
                    await prisma.purchase.update({
                        where: { id: existingPurchase.id },
                        data: { productName: snapTitle }
                    });
                    logs.push(`[UPDATE] Backfilled name "${snapTitle}" for existing purchase ${paymentId}`);
                } else {
                    logs.push(`[SKIP] Payment ${paymentId} already recorded.`);
                }
                continue;
            }

            if (userId && (finalCourseId || finalBundleId || amount > 0)) {
                const anyP = p as any;
                await prisma.purchase.create({
                    data: {
                        paymentId,
                        userId,
                        courseId: finalCourseId,
                        bundleId: finalBundleId,
                        productName: snapTitle,
                        amount,
                        status: 'approved',
                        preferenceId: anyP.order?.id?.toString() || "",
                    }
                });
                recoveredCount++;
                logs.push(`[SUCCESS] Recovered purchase ${paymentId} ($${amount}) - "${snapTitle}" for ${email}`);
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
