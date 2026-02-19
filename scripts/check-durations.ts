
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const lessons = await prisma.lesson.findMany({
        select: {
            id: true,
            title: true,
            duration: true,
            videoUrl: true,
            module: {
                select: {
                    title: true,
                    course: {
                        select: {
                            title: true
                        }
                    }
                }
            }
        }
    });

    console.log(`Total lessons: ${lessons.length}`);

    const zeroDurationLessons = lessons.filter(l => l.duration === 0);
    console.log(`Lessons with 0 duration: ${zeroDurationLessons.length}`);

    if (zeroDurationLessons.length > 0) {
        console.log("Sample of lessons with 0 duration:");
        zeroDurationLessons.slice(0, 5).forEach(l => {
            console.log(`- [${l.module.course.title}] ${l.module.title} > ${l.title} (URL: ${l.videoUrl})`);
        });
    }

    const validDurationLessons = lessons.filter(l => l.duration > 0);
    if (validDurationLessons.length > 0) {
        console.log("\nSample of VALID duration lessons:");
        validDurationLessons.slice(0, 5).forEach(l => {
            console.log(`- ${l.title}: ${l.duration} (seconds?)`);
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
