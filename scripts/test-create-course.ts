import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query']
});

async function main() {
    try {
        console.log("Attempting to create course...");
        const course = await prisma.course.create({
            data: {
                title: "Test Course",
                description: "Test Description",
                price: 1000,
                imageUrl: null,
                published: false
            }
        });
        console.log("Success! Created course:", course);
    } catch (error) {
        console.error("Error creating course:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
