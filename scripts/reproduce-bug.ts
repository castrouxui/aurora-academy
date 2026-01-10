import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting reproduction script...');

    // 1. Create a Test Course
    const course = await prisma.course.create({
        data: {
            title: "Reproduction Course",
            price: 100,
            description: "Test",
        }
    });
    console.log(`Created Course: ${course.id}`);

    // 2. Create Module
    const module = await prisma.module.create({
        data: {
            title: "Module 1",
            courseId: course.id,
            position: 0
        }
    });
    console.log(`Created Module: ${module.id}`);

    // 3. Create Two Lessons
    const lesson1 = await prisma.lesson.create({
        data: { title: "Lesson 1", moduleId: module.id, position: 0 }
    });
    const lesson2 = await prisma.lesson.create({
        data: { title: "Lesson 2", moduleId: module.id, position: 1 }
    });
    console.log(`Created Lesson 1: ${lesson1.id}`);
    console.log(`Created Lesson 2: ${lesson2.id}`);

    // 4. Add Resource to Lesson 1
    const resource = await prisma.resource.create({
        data: {
            title: "Resource for Lesson 1",
            url: "http://example.com/1.pdf",
            lessonId: lesson1.id
        }
    });
    console.log(`Created Resource for Lesson 1: ${resource.id}`);

    // 5. Verify Database State
    const l1check = await prisma.lesson.findUnique({
        where: { id: lesson1.id },
        include: { resources: true }
    });
    const l2check = await prisma.lesson.findUnique({
        where: { id: lesson2.id },
        include: { resources: true }
    });

    console.log("--- Verification ---");
    console.log(`Lesson 1 Resources: ${l1check?.resources.length} (Expected: 1)`);
    console.log(`Lesson 2 Resources: ${l2check?.resources.length} (Expected: 0)`);

    if (l2check?.resources.length !== 0) {
        console.error("CRITICAL FAILURE: Lesson 2 has resources it shouldn't have!");
        console.log(JSON.stringify(l2check?.resources, null, 2));
    } else {
        console.log("SUCCESS: Backend/DB integrity is maintained properly.");
    }

    // Cleanup
    await prisma.course.delete({ where: { id: course.id } });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
