import { prisma } from "../src/lib/prisma";

async function main() {
    const courseId = "cml05hq7n00025z0eogogsnge";
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });

    if (!course) {
        console.log("Course not found");
        return;
    }

    console.log(`Updating durations for: ${course.title}`);
    for (const module of course.modules) {
        for (const lesson of module.lessons) {
            // Generate random duration between 5 and 15 minutes (300 - 900 seconds)
            const randomDuration = Math.floor(Math.random() * (900 - 300 + 1)) + 300;
            await prisma.lesson.update({
                where: { id: lesson.id },
                data: { duration: randomDuration }
            });
            console.log(`Updated ${lesson.title}: ${randomDuration}s`);
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
