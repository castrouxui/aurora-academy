const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Skip lightweight fetch, do full fetch directly
    const coursesWithLessons = await prisma.course.findMany({
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });

    coursesWithLessons.forEach(c => {
        const firstLesson = c.modules.flatMap(m => m.lessons)[0];
        console.log(`Course: ${c.title}`);
        console.log(`  ID: ${c.id}`);
        console.log(`  ImageUrl: ${c.imageUrl}`);
        console.log(`  First Lesson Video: ${firstLesson?.videoUrl || 'None'}`);
        console.log('---');
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
