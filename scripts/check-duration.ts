import { prisma } from "../src/lib/prisma";

async function main() {
    const courseId = "cml05hq7n00025z0eogogsnge";
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                include: {
                    lessons: {
                        select: { id: true, title: true, duration: true }
                    }
                }
            }
        }
    });

    if (!course) {
        console.log("Course not found");
        return;
    }

    let totalDuration = 0;
    console.log(`Course: ${course.title}`);
    course.modules.forEach(m => {
        console.log(`Module: ${m.title}`);
        m.lessons.forEach(l => {
            console.log(`  - ${l.title}: ${l.duration}s`);
            totalDuration += l.duration;
        });
    });

    console.log(`Total Duration: ${totalDuration}s`);
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    console.log(`Formatted: ${hours}h ${minutes}m`);
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
