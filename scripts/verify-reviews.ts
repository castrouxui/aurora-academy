import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const reviews = await prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            course: { select: { title: true } },
            user: { select: { name: true, image: true } }
        }
    });

    console.log("Latest Reviews:", JSON.stringify(reviews, null, 2));

    const count = await prisma.review.count();
    console.log("Total Reviews:", count);

    const courses = await prisma.course.findMany({
        where: { published: true },
        select: { title: true, _count: { select: { reviews: true } } }
    });
    console.log("\nReview Counts per Public Course:");
    courses.forEach(c => {
        if (c._count.reviews > 0) {
            console.log(`- ${c.title}: ${c._count.reviews} reviews`);
        }
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
