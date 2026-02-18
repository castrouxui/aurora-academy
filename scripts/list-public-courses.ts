import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany({
        where: { published: true },
        select: { id: true, title: true },
    });

    console.log("Public Courses:", JSON.stringify(courses, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
