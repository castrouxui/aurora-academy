import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { setTelegramWebhook } from "@/lib/telegram";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized.", { status: 401 });
    }

    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${protocol}://${host}` : "https://auroracademy.net");

    try {
        // Token must come from environment variables only for security
        const result = await setTelegramWebhook(baseUrl);
        return NextResponse.json({
            success: result.success,
            message: result.success ? "Webhook registrado correctamente" : (result.error || "Error al registrar webhook"),
            details: result.data || result.error || null,
            url: `${baseUrl}/api/webhooks/telegram`
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
