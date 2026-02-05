import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const REWARD_COURSE_TITLE = "El camino del inversor";
const REWARD_COUPON_CODE = "LANZAMIENTO10";

export async function checkAndgrantCourseReward(userId: string, courseId: string) {
    try {
        // 1. Check if this is the target course
        // Optimization: Fetch course title only if we don't know it yet, or just check DB.
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { title: true }
        });

        if (!course || course.title !== REWARD_COURSE_TITLE) {
            return { granted: false };
        }

        // 2. Check if reward already granted
        const existingReward = await prisma.userReward.findUnique({
            where: {
                userId_courseId_rewardType: {
                    userId,
                    courseId,
                    rewardType: "COURSE_COMPLETION"
                }
            }
        });

        if (existingReward) {
            return { granted: false, alreadyClaimed: true };
        }

        // 3. Check if course is actually 100% completed
        // Get total lessons in course
        const modules = await prisma.module.findMany({
            where: { courseId },
            include: { lessons: { select: { id: true } } }
        });

        const allLessonIds = modules.flatMap(m => m.lessons.map(l => l.id));

        if (allLessonIds.length === 0) return { granted: false };

        // Get user progress for these lessons
        const userProgress = await prisma.userProgress.findMany({
            where: {
                userId,
                lessonId: { in: allLessonIds },
                completed: true
            }
        });

        const isComplete = userProgress.length === allLessonIds.length;

        if (!isComplete) {
            return { granted: false };
        }

        // 4. Grant Reward
        await prisma.userReward.create({
            data: {
                userId,
                courseId,
                rewardType: "COURSE_COMPLETION",
                rewardId: REWARD_COUPON_CODE
            }
        });

        // 5. Send Email
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });

        if (user && user.email) {
            await sendRewardEmail(user.email, user.name || "Inversor");
        }

        return { granted: true, reward: REWARD_COUPON_CODE };

    } catch (error) {
        console.error("[REWARD_SYSTEM_ERROR]", error);
        return { granted: false, error };
    }
}

async function sendRewardEmail(email: string, name: string) {
    const subject = "🎓 ¡Felicitaciones! Tu regalo por completar el curso";

    // HTML Content
    const html = `
        <div style="text-align: center; font-family: sans-serif; color: #111827;">
            <h1 style="color: #5D5CDE; margin-bottom: 24px;">¡Objetivo Cumplido! 🚀</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 24px;">
                Hola <strong>${name}</strong>, ¡qué gran paso acabas de dar!
                <br><br>
                Completar <strong>"${REWARD_COURSE_TITLE}"</strong> demuestra tu compromiso real con tu futuro financiero.
                Sabemos que esto es solo el comienzo.
            </p>

            <div style="background-color: #F3F4F6; padding: 24px; border-radius: 12px; margin: 32px 0;">
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;">
                    Tu Recompensa
                </p>
                <div style="font-size: 32px; font-weight: 800; color: #111827; letter-spacing: 2px; margin-bottom: 8px;">
                    ${REWARD_COUPON_CODE}
                </div>
                <p style="margin: 0; color: #059669; font-weight: 600;">
                    10% OFF en tu Membresía Mensual
                </p>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 32px;">
                Usá este código para desbloquear todo el potencial de Aurora Academy y seguir operando con nosotros.
            </p>

            <a href="https://auroracademy.net/membresias" 
               style="display: inline-block; background-color: #5D5CDE; color: white; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(93, 92, 222, 0.4);">
                Canjear mi descuento ahora
            </a>
        </div>
    `;

    await sendEmail(email, subject, html, "¡Tenes un 10% OFF en tu membresía!");
}
