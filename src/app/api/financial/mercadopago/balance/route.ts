import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || (session.user.role !== "ADMIN" && !session.user.isCompanyAdmin)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const accessToken = process.env.MP_ACCESS_TOKEN;
        if (!accessToken) {
            return NextResponse.json({ error: "MP Access Token not configured" }, { status: 500 });
        }

        // Try to fetch user ID first if we don't know it, or just try to hit the balance endpoint if possible.
        // The endpoint is /users/{user_id}/mercadopago_account/balance
        // Valid endpoint usually requires user_id.
        // Let's first fetch "me" to get user_id.

        const meResponse = await fetch("https://api.mercadopago.com/users/me", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!meResponse.ok) {
            console.error("Failed to fetch MP user:", await meResponse.text());
            return NextResponse.json({ total_amount: 0, unavailable_total_amount: 0, available_amount: 0 }); // Fallback
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
            console.warn("Failed to fetch MP balance (likely scope issue):", await balanceResponse.text());
            // Return 0 or null to indicate unable to fetch
            return NextResponse.json({ total_amount: 0, available_amount: 0, currency_id: "ARS" });
        }

        const balanceData = await balanceResponse.json();

        return NextResponse.json(balanceData);

    } catch (error) {
        console.error("Error fetching MP balance:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
