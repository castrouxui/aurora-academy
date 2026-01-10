import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
                }
            },
            orderBy: {
                createdAt: 'desc'
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

        // Transform to match the UI expectations
        const enrolledCourses = purchases.map(purchase => {
            const course = purchase.course;
            let totalLessons = 0;
            let completedCount = 0;

            course.modules.forEach(module => {
                module.lessons.forEach(lesson => {
                    totalLessons++;
                    if (completedLessonIds.has(lesson.id)) {
                        completedCount++;
                    }
                });
            });

            const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

            return {
                id: course.id,
                title: course.title,
                description: course.description,
                imageUrl: course.imageUrl,
                progress: progress,
                totalLessons: totalLessons,
                completedLessons: completedCount,
                lastAccessed: purchase.updatedAt.toLocaleDateString()
            };
        });

        return NextResponse.json(enrolledCourses);
    } catch (error) {
        console.error("[MY_COURSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
