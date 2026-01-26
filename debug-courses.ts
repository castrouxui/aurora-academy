
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany();
    console.log("All Course Titles:");
    courses.forEach(c => console.log(`"${c.title}" - Image: ${c.imageUrl}`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
