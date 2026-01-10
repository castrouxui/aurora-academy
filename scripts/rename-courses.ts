
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Force load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const prisma = new PrismaClient();

async function main() {
    console.log("Fetching courses...");
    const courses = await prisma.course.findMany({
        orderBy: {
            price: 'asc'
        }
    });

    console.log(`Found ${courses.length} courses.`);

    const titles = [
        "Trading Inicial",
        "Trading Intermedio",
        "Trading Avanzado"
    ];

    for (let i = 0; i < courses.length; i++) {
        if (i < titles.length) {
            const course = courses[i];
            const newTitle = titles[i];
            console.log(`Renaming '${course.title}' (${course.price}) to '${newTitle}'`);

            await prisma.course.update({
                where: { id: course.id },
                data: { title: newTitle }
            });
        }
    }
    console.log("Done.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
