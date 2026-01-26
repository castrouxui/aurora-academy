
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany({
        select: {
            id: true,
            title: true,
            imageUrl: true,
        },
    });

    console.log("Current Courses:");
    courses.forEach(c => {
        console.log(`ID: ${c.id} | Title: ${c.title} | Image: ${c.imageUrl}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
