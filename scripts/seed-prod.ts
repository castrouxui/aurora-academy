
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const backupPath = path.join(process.cwd(), 'backup-data.json');

    if (!fs.existsSync(backupPath)) {
        console.error('❌ No backup-data.json found. Run backup-local.ts first.');
        process.exit(1);
    }

    console.log('🧹 Clearing existing data...');
    // Delete in order to respect foreign keys (although Cascade helps)
    await prisma.userProgress.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.purchase.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.membershipItem.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.module.deleteMany();
    await prisma.course.deleteMany();
    await prisma.bundle.deleteMany();
    await prisma.user.deleteMany();
    // Also clear other relations if needed
    console.log('✨ Database cleared.');

    console.log('🌱 Reading backup...');
    const data = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    console.log('🚀 Seeding Users...');
    for (const user of data.users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {}, // Don't overwrite existing
            create: user,
        });
    }

    console.log('🚀 Seeding Courses...');
    for (const course of data.courses) {
        const { modules, resources, ...courseData } = course;

        // Create Course
        const createdCourse = await prisma.course.upsert({
            where: { id: course.id },
            update: {},
            create: courseData,
        });

        // Create Modules & Lessons
        for (const mod of modules) {
            const { lessons, ...modData } = mod;
            await prisma.module.upsert({
                where: { id: mod.id },
                update: {},
                create: { ...modData, courseId: createdCourse.id },
            });

            for (const lesson of lessons) {
                await prisma.lesson.upsert({
                    where: { id: lesson.id },
                    update: {},
                    create: { ...lesson, moduleId: mod.id },
                });
            }
        }
    }

    console.log('🚀 Seeding Bundles...');
    console.log('🚀 Seeding Bundles...');
    for (const bundle of data.bundles) {
        const { items, courses, ...bundleData } = bundle;

        await prisma.bundle.upsert({
            where: { id: bundle.id },
            update: {},
            create: {
                ...bundleData,
                items: {
                    create: items.map((item: any) => ({
                        name: item.name,
                        content: item.content,
                        type: item.type,
                    }))
                },
                courses: {
                    connect: courses ? courses.map((c: any) => ({ id: c.id })) : []
                }
            },
        });
    }

    // Note: Connecting bundles to courses is tricky if strict normalized, 
    // but for now let's assume the Many-to-Many is handled by Prisma's create above if included properly.
    // Ideally, valid JSON backup preserves IDs.

    console.log('🚀 Seeding Purchases...');
    for (const purchase of data.purchases) {
        await prisma.purchase.upsert({
            where: { id: purchase.id },
            update: {},
            create: purchase,
        });
    }

    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
