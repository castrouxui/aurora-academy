import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { setTelegramWebhook } from "@/lib/telegram";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const session = await getServerSession(authOptions);

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized.", { status: 401 });
    }

    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${protocol}://${host}` : "https://auroracademy.net");

    // Allow passing token via URL if it's missing in Env Vars (for first-time setup)
    const urlToken = searchParams.get("token");

    try {
        const result = await setTelegramWebhook(baseUrl, urlToken || undefined);
        return NextResponse.json({
            success: result.success,
            message: result.success ? "Webhook registrado correctamente" : (result.error || "Error al registrar webhook"),
            tokenUsed: urlToken ? "Proporcionado via URL" : "Cargado desde Env Vars",
            details: result.data || result.error || null,
            url: `${baseUrl}/api/webhooks/telegram`
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
