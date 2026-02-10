"use server";

import { prisma } from "../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }
    return session;
}

export async function getAdminCareers() {
    await checkAdmin();
    return await prisma.career.findMany({
        include: {
            milestones: {
                orderBy: { position: 'asc' }
            },
            _count: {
                select: { userCareers: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getAdminCareerById(careerId: string) {
    await checkAdmin();
    const career = await prisma.career.findUnique({
        where: { id: careerId },
        include: {
            milestones: {
                orderBy: { position: 'asc' }
            }
        }
    });

    if (!career) return null;

    // Fetch related course data for milestones
    const courseIds = career.milestones
        .filter(m => m.type === 'COURSE' && m.courseId)
        .map(m => m.courseId!);

    const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true, imageUrl: true, price: true }
    });

    const coursesMap = new Map(courses.map(c => [c.id, c]));

    const enrichedMilestones = career.milestones.map(m => {
        if (m.type === 'COURSE' && m.courseId) {
            return { ...m, course: coursesMap.get(m.courseId) };
        }
        return m;
    });

    return { ...career, milestones: enrichedMilestones };
}

export async function getAllCourses() {
    await checkAdmin();
    // Return basics for selection list
    return await prisma.course.findMany({
        select: { id: true, title: true, imageUrl: true, published: true, price: true },
        orderBy: { title: 'asc' }
    });
}

export async function updateCareerMilestones(careerId: string, newMilestones: any[]) {
    await checkAdmin();

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Delete existing milestones
            await tx.careerMilestone.deleteMany({
                where: { careerId }
            });

            // 2. Create new milestones in order
            for (let i = 0; i < newMilestones.length; i++) {
                const ms = newMilestones[i];
                await tx.careerMilestone.create({
                    data: {
                        careerId,
                        position: i,
                        type: ms.type,
                        courseId: ms.type === 'COURSE' ? ms.courseId : null
                    }
                });
            }
        });

        revalidatePath(`/admin/careers/${careerId}`);
        revalidatePath(`/dashboard`); // Update user view
        return { success: true };
    } catch (error) {
        console.error("Error updating career milestones:", error);
        throw new Error("Error al actualizar la hoja de ruta");
    }
}
