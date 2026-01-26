
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany({
        select: {
            id: true,
            title: true,
            imageUrl: true
        }
    });

    console.log("Found " + courses.length + " courses:");
    courses.forEach(c => {
        console.log(`[${c.id}] ${c.title}: ${c.imageUrl}`);
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
