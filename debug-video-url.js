const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCourse() {
    const courseId = 'cmk76jxm700002i3ojyfpjbm5';
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

    console.log("Course Found:", course.title);

    const firstModule = course.modules.sort((a, b) => a.position - b.position)[0];
    const firstLesson = firstModule?.lessons.sort((a, b) => a.position - b.position)[0];

    console.log("First Lesson:", firstLesson?.title);
    console.log("Video URL:", firstLesson?.videoUrl);
}

checkCourse()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
