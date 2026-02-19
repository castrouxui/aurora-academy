import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { MENTOR_PROMPT, TUTOR_PROMPT, OPERATOR_PROMPT } from "@/lib/chat/prompts";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

/* ─── Course title map for context injection ─── */
const COURSE_TITLES: Record<string, string> = {
    cml05hq7n00025z0eogogsnge: "El camino del inversor",
    cmk76vago00052i3oi9ajtj81: "Análisis Técnico",
    cmk77d6jw00162i3o2xduugqj: "Renta Fija",
    cmkvizzkv000014opaskujn6u: "Finanzas Personales",
    cmkbfyovj0000iv7p7dwuyjbc: "Opciones Financieras",
    cmke3r7q600025b9gasf4r0jr: "Futuros Financieros",
    cml2grqhs0005szmiu6q72oaw: "Fondos Comunes de Inversión",
    cml2ggu690000szmi2uarsi6e: "Machine Learning e IA",
    cmky03zq30004t8b2fwg93678: "Testing con IA",
    cmkigsyen000kkb3n05vphttk: "Valuación de Bonos",
    cmleeinzo0000lk6ifkpg84m1: "Los 7 Pilares del Éxito en Bolsa",
    cmkigoac4000akb3nnhyypiic: "Domina el Stop Loss",
    cmkigqmn4000fkb3nd3eyxd5m: "El Valor del Tiempo: TNA, TEA y TIR",
    cmkigidme0000kb3nyhnjeyt6: "Beneficio vs. Caja",
    cmkigm36w0005kb3n1hkgjuin: "Dominando el Riesgo",
    cmkb3mgzw0000d3a47s50rk9t: "Introducción al Mercado de Capitales",
    cmkb3vwqf0001yj6t5lbqq7h8: "Mentoría Análisis Técnico",
    cmkb45yfn0000l51swh07aw37: "Mentoría Gestión de Cartera",
    cmkb3u2nv0000yj6tef9f2xup: "Análisis Fundamental",
    cmk76jxm700002i3ojyfpjbm5: "Price Action",
    cmku6uohg000014bcqk7yysrc: "IA en Inversiones",
    cmlpu5m900000fugwd22skz53: "Manejo de TradingView",
};

/* ─── Price keywords that trigger comparison mode ─── */
const PRICE_KEYWORDS = ["precio", "comprar", "cuánto sale", "cuanto sale", "vale la pena", "caro", "barato", "cuesta", "pagar", "cobran"];

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
        pathname?.includes("/cursos/") ||
        pathname?.includes("/clase") ||
        userContent.includes("curso") ||
        userContent.includes("técnico") ||
        userContent.includes("análisis") ||
        userContent.includes("riesgo")
    ) {
        systemPrompt = TUTOR_PROMPT;
        activeAgent = "Tutor";
    }

    // ── URL-Aware Context Injection ──
    let contextAddendum = "";

    // Inject current course context
    const courseMatch = pathname?.match(/\/cursos\/([a-z0-9]+)/i);
    if (courseMatch) {
        const courseId = courseMatch[1];
        const courseTitle = COURSE_TITLES[courseId];
        if (courseTitle) {
            contextAddendum += `\n\nCONTEXTO ACTUAL: El usuario está viendo el curso "${courseTitle}" (URL: https://auroracademy.net/cursos/${courseId}). Hacé tu primera respuesta relevante a este curso. No des un saludo genérico — referite al tema del curso y hacé una pregunta que invite a la conversación.`;
        }
    }

    // Inject membership page context
    if (pathname?.includes("/membresias")) {
        contextAddendum += `\n\nCONTEXTO ACTUAL: El usuario está en la página de membresías. Ayudalo a elegir el plan ideal según sus objetivos. Podés usar {{PRODUCT_CARD}} para destacar el plan recomendado.`;
    }

    // Inject checkout context
    if (pathname?.includes("/checkout")) {
        contextAddendum += `\n\nCONTEXTO ACTUAL: El usuario está en el checkout, a punto de comprar. Sé breve y útil. Respondé dudas de forma concisa y generá confianza. No empujes más productos a menos que pregunte.`;
    }

    // ── Price/Comparison Mode ──
    const isPriceQuery = PRICE_KEYWORDS.some((kw) => userContent.includes(kw));
    if (isPriceQuery) {
        contextAddendum += `\n\nMODO COMPARATIVA ACTIVADO: El usuario preguntó sobre precio o compra. Respondé con una comparativa usando un token {{COMPARE}} que muestre el curso individual vs la membresía más accesible. Siempre destacá el ahorro de la membresía.`;
    }

    // Add instruction for REQUEST_DIAGNOSIS_START trigger
    if (userContent === "request_diagnosis_start") {
        contextAddendum += `\n\nIMPORTANT: The user has just triggered the diagnosis flow. Ignore the text "REQUEST_DIAGNOSIS_START" and immediately ask the Key Question: "Para recomendarte el mejor camino, ¿qué experiencia tenés gestionando tus ahorros e inversiones?"`;
    }

    try {
        console.log(`[API] Stream start for: ${pathname}`);
        const result = await streamText({
            model: openai("gpt-4o"),
            system: systemPrompt + contextAddendum,
            messages: messages.map((m: any) => ({
                role: m.role,
                content: m.content,
            })),
            onFinish: ({ text, finishReason }) => {
                console.log(`[API] Stream finished. Reason: ${finishReason}, Text length: ${text.length}`);
                if (finishReason !== "stop") {
                    console.warn(`[API] Abnormal finish reason: ${finishReason}`);
                }
            },
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Chat API error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate response" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
