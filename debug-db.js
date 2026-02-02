
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bundles = await prisma.bundle.findMany();
    console.log('Bundles:', bundles.length);

    const courses = await prisma.course.findMany();
    console.log('Courses:', courses.length);

    if (courses.length > 0) {
        console.log('First Course:', courses[0]);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
