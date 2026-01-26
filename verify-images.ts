
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany({
        select: { title: true, imageUrl: true }
    });
    console.log("--- FINAL COURSE IMAGES ---");
    courses.forEach(c => console.log(`Course: ${c.title}\nImage:  ${c.imageUrl}\n`));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
