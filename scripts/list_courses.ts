import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Listing Courses...");
    const courses = await prisma.course.findMany({
        select: { id: true, title: true, price: true }
    });
    console.log(JSON.stringify(courses, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
