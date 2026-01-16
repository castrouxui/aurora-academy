
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Searching for courses with 'Mentoria'...");

    const courses = await prisma.course.findMany({
        where: {
            title: {
                contains: "Mentoria",
                // mode: 'insensitive' // SQLite doesn't support generic insensitive, but let's try basic
            }
        },
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });

    if (courses.length === 0) {
        console.log("No courses found.");
    }

    courses.forEach((c: any) => {
        console.log(`Course Found: "${c.title}" (ID: ${c.id})`);
        c.modules.forEach((m: any) => {
            console.log(`  Module: ${m.title}`);
            m.lessons.forEach((l: any) => {
                console.log(`    - Lesson: ${l.title} (ID: ${l.id})`);
                console.log(`      URL: ${l.videoUrl}`);
            });
        });
        console.log("------------------------------------------------");
    });
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
