
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const targetId = "cmkb3mgzw0000d3a47s50rk9t";
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
