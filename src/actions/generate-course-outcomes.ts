"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function generateCourseOutcomes(courseId: string, description: string, modulesSummary: string) {
    try {
        const { object } = await generateObject({
            model: openai("gpt-4o"),
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

        // Cache the result in the database
        // Assuming database stores learningOutcomes as a newline-separated string
        const outcomesString = object.outcomes.join("\n");

        await prisma.course.update({
            where: { id: courseId },
            data: { learningOutcomes: outcomesString }
        });

        return object.outcomes;
    } catch (error) {
        console.error("Error generating course outcomes:", error);
        return []; // Fallback
    }
}
