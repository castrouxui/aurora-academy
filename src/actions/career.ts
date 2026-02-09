"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCareerProgress(userId: string, careerReferenceId: string) {
    const career = await prisma.career.findUnique({
        where: { referenceId: careerReferenceId },
        include: {
            milestones: {
                orderBy: { position: 'asc' }
            },
            userCareers: {
                where: { userId }
            }
        }
    });

    if (!career) return null;

    const userCareer = career.userCareers[0];

    // Fetch user status
    const subscriptions = await prisma.subscription.findMany({
        where: { userId, status: 'active' }
    });
    const hasActiveSubscription = subscriptions.length > 0;

    const milestonesWithStatus = await Promise.all(career.milestones.map(async (milestone) => {
        let completed = false;

        if (milestone.type === "COURSE" && milestone.courseId) {
            // Check if course is completed
            const allLessons = await prisma.lesson.findMany({
                where: { module: { courseId: milestone.courseId } },
                select: { id: true }
            });

            const completedLessons = await prisma.userProgress.count({
                where: {
                    userId,
                    lessonId: { in: allLessons.map(l => l.id) },
                    completed: true
                }
            });

            completed = allLessons.length > 0 && completedLessons === allLessons.length;
        } else if (milestone.type === "SUBSCRIPTION") {
            completed = hasActiveSubscription;
        }

        return {
            ...milestone,
            completed
        };
    }));

    const totalMilestones = milestonesWithStatus.length;
    const completedCount = milestonesWithStatus.filter(m => m.completed).length;
    const progressPercentage = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

    // Persist progress if changed
    if (!userCareer || userCareer.progress !== progressPercentage) {
        await prisma.userCareer.upsert({
            where: {
                userId_careerId: {
                    userId,
                    careerId: career.id
                }
            },
            update: {
                progress: progressPercentage,
                status: progressPercentage === 100 ? "COMPLETED" : "IN_PROGRESS",
                lastSyncAt: new Date()
            },
            create: {
                userId,
                careerId: career.id,
                progress: progressPercentage,
                status: progressPercentage === 100 ? "COMPLETED" : "IN_PROGRESS"
            }
        });
        revalidatePath("/dashboard");
    }

    return {
        careerName: career.name,
        progress: progressPercentage,
        milestones: milestonesWithStatus,
        hasActiveSubscription
    };
}

export async function syncAllUserCareers(userId: string) {
    const careers = await prisma.career.findMany({
        where: { published: true },
        select: { referenceId: true }
    });

    for (const career of careers) {
        await getCareerProgress(userId, career.referenceId);
    }
}
