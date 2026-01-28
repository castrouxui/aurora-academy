
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Searching for 'Psicología' courses...");
    const courses = await prisma.course.findMany({
        where: {
            title: { contains: 'Psicología', mode: 'insensitive' }
        },
        include: {
            bundles: true
        }
    });

    if (courses.length === 0) {
        console.log("❌ No courses found with 'Psicología' in title.");
    } else {
        console.log(`✅ Found ${courses.length} courses:`);
        courses.forEach(c => {
            console.log(`- [${c.id}] ${c.title} (Published: ${c.published})`);
            console.log(`  Linked to Bundles:`);
            if (c.bundles.length === 0) console.log("    (None)");
            c.bundles.forEach(b => console.log(`    - [${b.id}] ${b.title}`));
        });
    }

    console.log("\n🔍 Listing ALL Bundles and their contents:");
    const bundles = await prisma.bundle.findMany({
        include: { courses: { select: { title: true, id: true } } }
    });

    bundles.forEach(b => {
        console.log(`📦 Bundle: ${b.title} (${b.courses.length} courses)`);
        b.courses.forEach(c => console.log(`   - ${c.title}`));
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
