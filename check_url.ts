
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const targetId = process.argv[2];

    if (!targetId) {
        console.log("No ID provided. Listing recent lessons to help you find one:");
        const lessons = await prisma.lesson.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });
        lessons.forEach((l: any) => {
            console.log(`ID: ${l.id}`);
            console.log(`Title: ${l.title}`);
            console.log(`URL: ${l.videoUrl}`);
            console.log("---");
        });
        console.log("\nUsage: npx ts-node check_url.ts <ID>");
        return;
    }

    console.log(`Checking ID: ${targetId}`);

    // Check if it's a Course
    const course = await prisma.course.findUnique({
        where: { id: targetId },
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });

    if (course) {
        console.log("=== FOUND COURSE ===");
        console.log(`Course Title: ${course.title}`);

        course.modules.forEach((mod: any) => {
            console.log(`Module: ${mod.title}`);
            mod.lessons.forEach((l: any) => {
                console.log(`  - Lesson: ${l.title} (ID: ${l.id})`);
                console.log(`    URL: ${l.videoUrl}`);
            });
        });
        return;
    }

    // Check if it's a Lesson
    const lesson = await prisma.lesson.findUnique({
        where: { id: targetId }
    });

    if (lesson) {
        console.log("=== FOUND LESSON ===");
        console.log(`Title: ${lesson.title}`);
        console.log(`URL: ${lesson.videoUrl}`);
        return;
    }

    console.log("ID not found in Course or Lesson tables.");
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
