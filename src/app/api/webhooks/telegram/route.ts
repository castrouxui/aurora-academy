import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message } = body;

        if (message && message.text === "/start") {
            const chatId = message.chat.id.toString();
            const responseText = `👋 <b>¡Bienvenido a Aurora Academy!</b>\n\nTu ID de chat es: <code>${chatId}</code>\n\nCopiá este número y pegalo en la sección de "Configuración" de tu perfil para verificar tu cuenta.`;

            await sendTelegramMessage(chatId, responseText);
        }

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        console.error("Telegram Webhook Error:", error);
        // Always return 200 to Telegram to avoid retries on failure
        return NextResponse.json({ ok: false }, { status: 200 });
    }
}
