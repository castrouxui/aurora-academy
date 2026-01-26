import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { setTelegramWebhook } from "@/lib/telegram";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const host = req.headers.get("host") || "aurora-academy.onrender.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    try {
        const result = await setTelegramWebhook(baseUrl);
        return NextResponse.json({
            success: result.success,
            message: result.success ? "Webhook registrado correctamente" : "Error al registrar webhook",
            details: result.data,
            url: `${baseUrl}/api/webhooks/telegram`
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
