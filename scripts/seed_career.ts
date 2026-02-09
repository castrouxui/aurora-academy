import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🌱 Seeding Career: Trader de 0 a 100...");

    // 1. Create or Update the Courses
    const course1 = await prisma.course.upsert({
        where: { id: "cl_camino_inversor" }, // Using a stable ID for easier dev
        update: {},
        create: {
            id: "cl_camino_inversor",
            title: "El camino del inversor",
            description: "Curso introductorio al mundo de las inversiones.",
            price: 0,
            published: true,
            category: "Trading",
            level: "Principiante"
        }
    });

    const course2 = await prisma.course.upsert({
        where: { id: "cl_7_pilares_exito" },
        update: {},
        create: {
            id: "cl_7_pilares_exito",
            title: "Los 7 Pilares del Éxito en Bolsa",
            description: "Estrategias avanzadas para operar en bolsa.",
            price: 7000,
            published: true,
            category: "Trading",
            level: "Intermedio"
        }
    });

    // 2. Create the Career
    const career = await prisma.career.upsert({
        where: { referenceId: "career-trader-100" },
        update: {
            name: "Trader de 0 a 100",
            published: true,
        },
        create: {
            name: "Trader de 0 a 100",
            referenceId: "career-trader-100",
            published: true,
        }
    });

    // 3. Create Milestones
    // Clear existing to avoid duplicates if re-running
    await prisma.careerMilestone.deleteMany({
        where: { careerId: career.id }
    });

    await prisma.careerMilestone.createMany({
        data: [
            {
                careerId: career.id,
                courseId: course1.id,
                type: "COURSE",
                position: 1
            },
            {
                careerId: career.id,
                courseId: course2.id,
                type: "COURSE",
                position: 2
            },
            {
                careerId: career.id,
                type: "SUBSCRIPTION",
                position: 3
            }
        ]
    });

    console.log("✅ Career and Milestones seeded successfully.");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
