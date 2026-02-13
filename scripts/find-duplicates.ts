import { prisma } from "../src/lib/prisma";

async function main() {
    const courses = await prisma.course.findMany({
        select: {
            id: true,
            title: true,
            imageUrl: true,
            published: true,
            price: true,
            updatedAt: true,
        }
    });

    console.log("Found courses:", courses.length);
    console.log(JSON.stringify(courses, null, 2));

    // Search by specific ID from seed
    const seededCourse = await prisma.course.findUnique({
        where: { id: "cml05hq7n00025z0eogogsnge" }
    });
    console.log("Seeded course found:", seededCourse ? JSON.stringify(seededCourse, null, 2) : "NOT FOUND");

    // Search by title
    const titleCourses = await prisma.course.findMany({
        where: { title: { contains: "inversor", mode: "insensitive" } }
    });
    console.log("Courses with 'inversor' in title:", JSON.stringify(titleCourses, null, 2));

    const allCourses = await prisma.course.findMany();
    console.log("All courses count:", allCourses.length);
    console.log("All IDs:", allCourses.map(c => c.id));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
