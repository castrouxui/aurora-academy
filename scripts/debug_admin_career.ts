
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("--- DEBUGGING CAREER DATA ---");

    // 1. Get all courses count and list a few
    const coursesCount = await prisma.course.count();
    console.log(`Total Courses: ${coursesCount}`);

    const allCourses = await prisma.course.findMany({
        select: { id: true, title: true }
    });
    console.log("Available Course IDs:", allCourses.map(c => `${c.id} (${c.title})`));

    // 2. Get Career Milestones
    const career = await prisma.career.findUnique({
        where: { referenceId: "career-trader-100" },
        include: { milestones: true }
    });

    if (!career) {
        console.log("Career 'career-trader-100' not found");
        return;
    }

    console.log(`\nCareer: ${career.name} (${career.id})`);
    console.log("Milestones:");
    for (const m of career.milestones) {
        console.log(` - Position ${m.position}: Type=${m.type}, CourseId=${m.courseId}`);
        if (m.type === 'COURSE' && m.courseId) {
            const exists = allCourses.find(c => c.id === m.courseId);
            console.log(`   -> Exists in DB? ${exists ? 'YES' : 'NO'}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
