"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

async function seedTraderCareerIfMissing() {
    try {
        console.log("🌱 Seeding 'Trader de 0 a 100' career (self-healing)...");

        // Ensure courses exist (minimal version if they don't)
        await prisma.course.upsert({
            where: { id: "cl_camino_inversor" },
            update: { published: true },
            create: {
                id: "cl_camino_inversor",
                title: "El camino del inversor",
                description: "Curso introductorio al mundo de las inversiones.",
                price: 0,
                published: true,
                category: "Trading",
                level: "Principiante"
            }
        });

        await prisma.course.upsert({
            where: { id: "cl_7_pilares_exito" },
            update: { published: true },
            create: {
                id: "cl_7_pilares_exito",
                title: "Los 7 Pilares del Éxito en Bolsa",
                description: "Estrategias avanzadas para operar en bolsa.",
                price: 7000,
                published: true,
                category: "Trading",
                level: "Intermedio"
            }
        });

        const career = await prisma.career.upsert({
            where: { referenceId: "career-trader-100" },
            update: { published: true },
            create: {
                id: "career-trader-100-id",
                name: "Trader de 0 a 100",
                referenceId: "career-trader-100",
                published: true
            }
        });

        // Positions: 0 (Free), 1 (Paid), 2 (Subscription)
        const milestones = [
            { courseId: "cl_camino_inversor", type: "COURSE", position: 0 },
            { courseId: "cl_7_pilares_exito", type: "COURSE", position: 1 },
            { courseId: null, type: "SUBSCRIPTION", position: 2 }
        ];

        for (const m of milestones) {
            await prisma.careerMilestone.upsert({
                where: {
                    id: `ms-${career.id}-${m.position}`
                },
                update: { ...m, careerId: career.id },
                create: {
                    id: `ms-${career.id}-${m.position}`,
                    ...m,
                    careerId: career.id
                }
            });
        }
        console.log("✅ Career seeded successfully via self-healing.");
        return career;
    } catch (error) {
        console.error("❌ Error in self-healing seed:", error);
        return null;
    }
}

export async function getCareerProgress(userId: string, careerReferenceId: string) {
    let career = await prisma.career.findUnique({
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

    if (!career && careerReferenceId === "career-trader-100") {
        console.log("🛠️ Career missing, triggering self-healing...");
        await seedTraderCareerIfMissing();
        career = await prisma.career.findUnique({
            where: { referenceId: careerReferenceId },
            include: {
                milestones: { orderBy: { position: 'asc' } },
                userCareers: { where: { userId } }
            }
        });
    }

    if (!career) {
        console.error(`❌ Career not found after self-healing: ${careerReferenceId}`);
        return null;
    }

    const userCareer = career.userCareers[0];

    // Fetch user status
    const subscriptions = await prisma.subscription.findMany({
        where: { userId, status: 'active' }
    });
    const hasActiveSubscription = subscriptions.length > 0;

    // Fetch user purchases for specific courses
    const userPurchases = await prisma.purchase.findMany({
        where: {
            userId,
            status: 'approved', // Assuming 'approved' is the status for successful purchases
            courseId: { in: career.milestones.filter(m => m.type === 'COURSE' && m.courseId).map(m => m.courseId!) }
        }
    });

    const purchasedCourseIds = new Set(userPurchases.map(p => p.courseId));

    const milestonesWithStatus = await Promise.all(career.milestones.map(async (milestone, index) => {
        let completed = false;
        let isLocked = true;
        let milestoneDetails: any = {
            title: "",
            description: "",
            imageUrl: "",
            price: 0
        };

        if (milestone.type === "COURSE" && milestone.courseId) {
            // Fetch course details
            const course = await prisma.course.findUnique({
                where: { id: milestone.courseId },
                select: { title: true, description: true, imageUrl: true, price: true }
            });

            if (course) {
                milestoneDetails = {
                    title: course.title,
                    description: course.description,
                    imageUrl: course.imageUrl,
                    price: Number(course.price)
                };
            }

            // Lock Logic
            if (index === 0) {
                // Step 1: Always Unlocked (Free)
                isLocked = false;
            } else if (index === 1) {
                // Step 2: Unlocked if Purchased OR Subscription
                if (purchasedCourseIds.has(milestone.courseId) || hasActiveSubscription) {
                    isLocked = false;
                }
            } else {
                // Default fallback
                if (purchasedCourseIds.has(milestone.courseId) || hasActiveSubscription) {
                    isLocked = false;
                }
            }

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
            milestoneDetails = {
                title: "Membresía Aurora",
                description: "Acceso total a la academia.",
                imageUrl: "/images/membership.jpg", // Placeholder
                price: 0
            };
            isLocked = !hasActiveSubscription;
            completed = hasActiveSubscription;
        }

        return {
            ...milestone,
            completed,
            isLocked,
            ...milestoneDetails
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
        try {
            revalidatePath("/dashboard");
        } catch (e) {
            // Ignored: likely running in script context
        }
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
