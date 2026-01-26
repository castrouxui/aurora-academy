import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { setTelegramWebhook } from "@/lib/telegram";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const session = await getServerSession(authOptions);

    // Allow if admin session OR if secret matches (e.g. for one-time CLI/Direct use)
    const isAuthorized = (session && session.user.role === "ADMIN") || (secret && secret === process.env.NEXTAUTH_SECRET);

    if (!isAuthorized) {
        return new NextResponse("Unauthorized. Debes iniciar sesión como Admin o usar el secret key.", { status: 401 });
    }

    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${protocol}://${host}` : "https://auroracademy.net");

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
