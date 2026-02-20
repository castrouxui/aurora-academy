
import { PrismaClient } from '@prisma/client';
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("Starting batch generation of learning outcomes...");

    // Find courses with missing outcomes
    const courses = await prisma.course.findMany({
        where: {
            OR: [
                { learningOutcomes: null },
                { learningOutcomes: "" }
            ]
        },
        include: {
            modules: {
                select: { title: true }
            }
        }
    });

    console.log(`Found ${courses.length} courses needing updates.`);

    for (const course of courses) {
        console.log(`Processing: ${course.title}...`);

        const modulesSummary = course.modules.map(m => m.title).join(", ");
        const description = course.description || "Curso de finanzas";

        try {
            const { object } = await generateObject({
                model: google("models/gemini-flash-latest"),
                schema: z.object({
                    outcomes: z.array(z.string()).length(4),
                }),
                prompt: `
            A partir de la siguiente descripción y contenido de curso, generá exactamente 4 bullets concisos (máximo 12 palabras cada uno) que describan los resultados concretos que va a obtener el alumno al finalizar. 
            Escribilos en segunda persona, comenzando con un verbo en futuro. 
            Sin introducciones ni explicaciones, solo los 4 bullets.
            
            Descripción: "${description}"
            Módulos: "${modulesSummary}"
          `,
            });

            const outcomesString = object.outcomes.join("\n");

            await prisma.course.update({
                where: { id: course.id },
                data: { learningOutcomes: outcomesString }
            });

            console.log(`  ✅ Updated!`);
            console.log(`     - ${object.outcomes[0]}`);

        } catch (error) {
            console.error(`  ❌ Failed for ${course.title}:`, error);
        }
    }

    console.log("Batch generation complete.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
