import { prisma } from "../src/lib/prisma";

async function main() {
    const courseId = "cml05hq7n00025z0eogogsnge";

    // Check if course exists
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { modules: true }
    });

    if (!course) {
        console.log("Course not found");
        return;
    }

    if (course.modules.length > 0) {
        console.log("Course already has modules. Skipping population.");
        return;
    }

    console.log("Populating course with modules and lessons...");

    // Module 1
    const module1 = await prisma.module.create({
        data: {
            title: "Módulo 1: Introducción a las Inversiones",
            position: 1,
            courseId: courseId,
            lessons: {
                create: [
                    { title: "Bienvenida al curso", position: 1, duration: 300, published: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                    { title: "¿Por qué invertir?", position: 2, duration: 450, published: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                    { title: "Tipos de activos", position: 3, duration: 600, published: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
                ]
            }
        }
    });
    console.log("Created Module 1");

    // Module 2
    const module2 = await prisma.module.create({
        data: {
            title: "Módulo 2: Instrumentos Financieros",
            position: 2,
            courseId: courseId,
            lessons: {
                create: [
                    { title: "Acciones y CEDEARs", position: 1, duration: 900, published: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                    { title: "Bonos y Renta Fija", position: 2, duration: 750, published: true, videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
                ]
            }
        }
    });
    console.log("Created Module 2");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
