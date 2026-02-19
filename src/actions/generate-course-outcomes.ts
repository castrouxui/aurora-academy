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
        You are an expert instructional designer.
        Generate 3 to 4 concise, impact-driven learning outcomes for a course titled "${courseTitle}".
        
        Course Description:
        "${courseDescription}"
        
        Requirements:
        - Focus on what the student will be able to DO or ACHIEVE after the course.
        - Start with strong verbs (Dominar, Crear, Implementar, Analizar).
        - Keep each outcome under 60 characters if possible.
        - Tone: Professional, inspiring, direct.
        - Language: Spanish.
      `,
        });

        return object.outcomes;
    } catch (error) {
        console.error("Error generating course outcomes:", error);
        return []; // Fallback to empty array to handle gracefully
    }
}
