import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MercadoPagoConfig } from "mercadopago";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || (session.user.role !== "ADMIN" && !session.user.isCompanyAdmin)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const accessToken = process.env.MP_ACCESS_TOKEN;
        if (!accessToken) {
            console.error("[MP] Access Token missing in Env");
            return NextResponse.json({ error: "MP Access Token not configured" }, { status: 500 });
        }

        // Fetch user profile to get UserId
        const meResponse = await fetch("https://api.mercadopago.com/users/me", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!meResponse.ok) {
            const errorDetails = await meResponse.text();
            console.error("[MP] Me API Fail:", errorDetails);
            return NextResponse.json({
                available_amount: 0,
                unavailable_total_amount: 0,
                error: "Invalid Token or MP API down"
            });
        }

        const meData = await meResponse.json();
        const userId = meData.id;

        // Fetch Balance
        const balanceResponse = await fetch(`https://api.mercadopago.com/users/${userId}/mercadopago_account/balance`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!balanceResponse.ok) {
            const errorDetails = await balanceResponse.text();
            console.warn("[MP] Balance API Forbidden or Error:", errorDetails);

            // If we get Forbidden, it means the token lacks scope
            return NextResponse.json({
                available_amount: 0,
                unavailable_total_amount: 0,
                error: errorDetails.includes("forbidden") ? "Scope missing: Balance" : "API Error"
            });
        }

        const balanceData = await balanceResponse.json();
        return NextResponse.json(balanceData);

    } catch (error) {
        console.error("[MP] Balance Route Crash:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
