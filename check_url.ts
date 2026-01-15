
import { prisma } from "./src/lib/prisma";

async function checkLesson() {
    const lessons = await prisma.lesson.findMany({
        take: 10,
        orderBy: { updatedAt: 'desc' },
        select: {
            id: true,
            title: true,
            videoUrl: true,
            updatedAt: true
        }
    });

    console.log("Found Lessons:", JSON.stringify(lessons, null, 2));
}

checkLesson()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
