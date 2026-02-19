"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function generateCourseOutcomes(courseTitle: string, courseDescription: string) {
    try {
        const { object } = await generateObject({
            model: openai("gpt-4o"),
            schema: z.object({
                outcomes: z.array(z.string()).min(3).max(4),
            }),
            prompt: `
        You are an expert instructional designer and copywriter.
        Your task is to analyze the course description and synthesize the 3-4 most critical value propositions or skills the student will acquire.
        
        Course Title: "${courseTitle}"
        Course Description: "${courseDescription}"
        
        Requirements:
        1. **Summarize the Promise**: Do not just list topics. Explain what the student will be able to DO or ACHIEVE.
        2. **Action-Oriented**: Start with strong verbs (Validar, Construir, Dominar, Rentabilizar).
        3. **Concise**: Keep each outcome under 50 characters for mobile readability.
        4. **Language**: Spanish.
        5. **Format**: Returns a JSON array of strings.
        
        Example Output:
        - "Dominarás el análisis técnico desde cero"
        - "Crearás tu primer portafolio de inversión"
        - "Gestionarás el riesgo como un profesional"
      `,
        });

        return object.outcomes;
    } catch (error) {
        console.error("Error generating course outcomes:", error);
        return []; // Fallback to empty array to handle gracefully
    }
}
