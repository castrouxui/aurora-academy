
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking Production Data...');

    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    const bundleCount = await prisma.bundle.count();
    const purchaseCount = await prisma.purchase.count();
    const lessonCount = await prisma.lesson.count();

    const courses = await prisma.course.findMany({ select: { title: true, published: true } });
    console.log('--- Course List ---');
    courses.forEach(c => console.log(`- ${c.title} [${c.published ? 'Published' : 'Draft'}]`));

    console.log('--- Report ---');
    console.log(`Users: ${userCount}`);
    console.log(`Courses: ${courseCount}`);
    console.log(`Bundles: ${bundleCount}`);
    console.log(`Purchases: ${purchaseCount}`);
    console.log(`Lessons: ${lessonCount}`);

    // Check specifically for the purchases issue
    const purchases = await prisma.purchase.findMany();
    if (purchases.length > 0) {
        console.log(`Found ${purchases.length} purchases.`);
        for (const p of purchases) {
            const user = await prisma.user.findUnique({ where: { id: p.userId } });
            if (!user) {
                console.error(`❌ ORPHAN PURCHASE FOUND! Purchase ${p.id} points to missing user ${p.userId}`);
            } else {
                console.log(`✅ Purchase ${p.id} linked to valid user.`);
            }
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
