
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany({
        select: { title: true, id: true, learningOutcomes: true, description: true }
    });

    console.log(`Found ${courses.length} courses.`);
    courses.forEach(c => {
        console.log(`\n[${c.title}]`);
        console.log(`  Outcomes: ${c.learningOutcomes ? '✅ Present' : '❌ NULL'}`);
        if (c.learningOutcomes) {
            console.log(`  Preview: ${JSON.stringify(c.learningOutcomes).substring(0, 100)}...`);
        }
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
