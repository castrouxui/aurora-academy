import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { courseId, rating, comment } = await req.json();

        if (!courseId || !rating) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // 1. Verify that the user OWNS the course (or a bundle containing it)
        // We can check if they have a 'Purchase' or 'Subscription' for this course/bundle?
        // Actually, checking if they have access is complex (bundles vs direct).
        // Simplest way: Check Purchase matching courseId OR Purchase matching a bundle that contains the course.

        // Let's use a helper logic or just check Purchases directly for now. 
        // Note: Admin should be able to review? Maybe not.

        const hasAccess = await prisma.purchase.findFirst({
            where: {
                userId: session.user.id,
                OR: [
                    { courseId: courseId },
                    {
                        bundle: {
                            courses: {
                                some: { id: courseId }
                            }
                        }
                    }
                ],
                status: "approved"
            }
        });

        // Also check Subscriptions
        const hasSubscription = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                bundle: {
                    courses: {
                        some: { id: courseId }
                    }
                },
                status: "authorized"
            }
        });

        if (!hasAccess && !hasSubscription && session.user.role !== "ADMIN") {
            return new NextResponse("Must purchase course to review", { status: 403 });
        }

        // 2. Check Completion (Server-side validation)
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: { modules: { include: { lessons: { select: { id: true } } } } }
        });

        if (!course) return new NextResponse("Course not found", { status: 404 });

        const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
        const completedCount = await prisma.userProgress.count({
            where: {
                userId: session.user.id,
                lessonId: { in: allLessonIds },
                completed: true
            }
        });

        const isCompleted = allLessonIds.length > 0 && completedCount === allLessonIds.length;

        if (!isCompleted && session.user.role !== "ADMIN") {
            return new NextResponse("Must complete course to review", { status: 403 });
        }

        // 2. Create Review
        // Check if review already exists
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: session.user.id,
                courseId: courseId
            }
        });

        let review;

        if (existingReview) {
            // Update existing review
            review = await prisma.review.update({
                where: { id: existingReview.id },
                data: {
                    rating: Number(rating),
                    comment: comment || ""
                }
            });
        } else {
            // Create new review
            review = await prisma.review.create({
                data: {
                    userId: session.user.id,
                    courseId,
                    rating: Number(rating),
                    comment: comment || ""
                }
            });
        }

        return NextResponse.json(review);

    } catch (error) {
        console.error("[REVIEWS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
