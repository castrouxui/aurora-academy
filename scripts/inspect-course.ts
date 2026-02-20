
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Find "El camino del inversor" course
    const course = await prisma.course.findFirst({
        where: { title: { contains: "camino del inversor", mode: "insensitive" } },
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });

    if (!course) {
        console.log("Course not found!");
        return;
    }

    console.log(`Course: ${course.title}`);
    console.log(`Total Modules: ${course.modules.length}`);

    let totalDuration = 0;

    course.modules.forEach(m => {
        const modDuration = m.lessons.reduce((acc, l) => acc + (l.duration || 0), 0);
        totalDuration += modDuration;

        console.log(`\nModule: ${m.title} (Duration: ${modDuration}s)`);
        if (m.lessons.length === 0) console.log("  (No lessons)");

        m.lessons.forEach(l => {
            console.log(`  - Lesson: ${l.title}`);
            console.log(`    Duration: ${l.duration}s`);
            console.log(`    URL: ${l.videoUrl || 'NO URL'}`);
        });
    });

    console.log(`\nCalc Total Duration: ${totalDuration}s`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
