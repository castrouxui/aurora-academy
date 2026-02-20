
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    const description = "Aprende a invertir en bolsa desde cero con este curso completo.";
    const modulesSummary = "Introducción, Acciones, Bonos, Futuros, Opciones.";

    console.log("Testing OpenAI generation...");
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
        console.log("Success!", object.outcomes);
    } catch (e) {
        console.error("Failed:", e);
    }
}

main();
