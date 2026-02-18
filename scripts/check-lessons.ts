import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const lessons = await prisma.lesson.findMany({
        select: { title: true, module: { select: { title: true, course: { select: { title: true } } } } },
    });

    console.log("Lessons Sample:", JSON.stringify(lessons.slice(0, 10), null, 2));
    console.log("Total Lessons:", lessons.length);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
