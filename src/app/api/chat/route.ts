import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { MENTOR_PROMPT, TUTOR_PROMPT, OPERATOR_PROMPT } from "@/lib/chat/prompts";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, pathname } = await req.json();

    // Determine the context and select the appropriate agent
    let systemPrompt = MENTOR_PROMPT;
    let activeAgent = "Mentor";

    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage?.content?.toLowerCase() || "";

    // Check specific triggers
    if (userContent === "request_diagnosis_start") {
        systemPrompt = MENTOR_PROMPT;
        activeAgent = "Mentor";
    } else if (pathname?.includes("/checkout") || pathname?.includes("/pricing")) {
        systemPrompt = OPERATOR_PROMPT;
        activeAgent = "Operator";
    } else if (
        pathname?.includes("/course") ||
        pathname?.includes("/clase") ||
        userContent.includes("curso") ||
        userContent.includes("técnico") ||
        userContent.includes("análisis") ||
        userContent.includes("riesgo")
    ) {
        systemPrompt = TUTOR_PROMPT;
        activeAgent = "Tutor";
        // TODO: Implement RAG context retrieval here.
        // Example: const docContext = await retrieveContext(userContent);
        // systemPrompt += `\n\nContexto relevante: ${docContext}`;
    }

    // Add instruction to ignore "REQUEST_DIAGNOSIS_START" literal text and treat it as a trigger
    if (userContent === "request_diagnosis_start") {
        systemPrompt += `\n\nIMPORTANT: The user has just triggered the diagnosis flow. Ignore the text "REQUEST_DIAGNOSIS_START" and immediately ask the Key Question: "Para recomendarte el mejor camino, ¿qué experiencia tenés gestionando tus ahorros e inversiones?"`;
    }

    const result = await streamText({
        model: google("gemini-flash-latest"), // Using stable alias to avoid preview quota issues
        system: systemPrompt,
        messages: messages.map((m: any) => ({
            role: m.role,
            content: m.content,
        })),
    });

    return result.toTextStreamResponse();
}
