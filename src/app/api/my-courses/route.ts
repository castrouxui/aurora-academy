import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const purchases = await prisma.purchase.findMany({
            where: {
                userId: session.user.id,
                status: 'approved'
            },
            include: {
                course: {
                    include: {
                        modules: {
                            include: {
                                lessons: {
                                    select: {
                                        id: true
                                    }
                                }
                            }
                        }
                    }
                },
                bundle: {
                    include: {
                        courses: {
                            include: {
                                modules: {
                                    include: {
                                        lessons: {
                                            select: {
                                                id: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // 2. Fetch Active Subscriptions
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: session.user.id,
                status: { in: ['authorized'] }
            },
            include: {
                bundle: {
                    include: {
                        courses: {
                            include: {
                                modules: {
                                    include: {
                                        lessons: { select: { id: true } }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const userProgress = await prisma.userProgress.findMany({
            where: {
                userId: session.user.id,
                completed: true
            },
            select: {
                lessonId: true
            }
        });

        const completedLessonIds = new Set(userProgress.map(p => p.lessonId));

        // Use a Map to deduplicate courses (if user bought course separately and then in a bundle)
        const coursesMap = new Map();

        purchases.forEach(purchase => {
            // 1. Direct Course Purchase
            if (purchase.course) {
                coursesMap.set(purchase.course.id, { ...purchase.course, lastAccessed: purchase.updatedAt });
            }

            // 2. Bundle Purchase
            if (purchase.bundle && purchase.bundle.courses) {
                purchase.bundle.courses.forEach(bundleCourse => {
                    // Only add if not already present (prioritize direct purchase date or just first encounter)
                    if (!coursesMap.has(bundleCourse.id)) {
                        coursesMap.set(bundleCourse.id, { ...bundleCourse, lastAccessed: purchase.updatedAt });
                    }
                });
            }
        });

        // 3. Process Subscriptions (Grant temporary access)
        subscriptions.forEach(sub => {
            if (sub.bundle && sub.bundle.courses) {
                sub.bundle.courses.forEach(bundleCourse => {
                    // Add if not present (Subscription grants access just like a purchase)
                    if (!coursesMap.has(bundleCourse.id)) {
                        coursesMap.set(bundleCourse.id, { ...bundleCourse, lastAccessed: sub.updatedAt });
                    }
                });
            }
        });

        const allCourses = Array.from(coursesMap.values());

        // Transform to match the UI expectations
        const enrolledCourses = allCourses.map((course: any) => {
            let totalLessons = 0;
            let completedCount = 0;

            if (course.modules) {
                course.modules.forEach((module: any) => {
                    if (module.lessons) {
                        module.lessons.forEach((lesson: any) => {
                            totalLessons++;
                            if (completedLessonIds.has(lesson.id)) {
                                completedCount++;
                            }
                        });
                    }
                });
            }

            const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

            return {
                id: course.id,
                title: course.title,
                description: course.description,
                imageUrl: course.imageUrl,
                progress: progress,
                totalLessons: totalLessons,
                completedLessons: completedCount,
                lastAccessed: course.lastAccessed.toLocaleDateString()
            };
        });

        return NextResponse.json(enrolledCourses);
    } catch (error) {
        console.error("[MY_COURSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
