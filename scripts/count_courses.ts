import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { prisma } from "../src/lib/prisma";

async function main() {
    const count = await prisma.course.count();
    console.log(`TOTAL_COURSES: ${count}`);

    const courses = await prisma.course.findMany({
        select: { id: true, title: true },
        orderBy: { title: 'asc' }
    });

    console.log("COURSE_LIST_START");
    courses.forEach(c => console.log(`${c.id} | ${c.title}`));
    console.log("COURSE_LIST_END");

    const career = await prisma.career.findUnique({
        where: { referenceId: "career-trader-100" },
        include: { milestones: true }
    });
    console.log(`CAREER_MILESTONES: ${career?.milestones.length}`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
