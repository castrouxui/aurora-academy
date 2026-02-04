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

        // 1. Try Fetching profile for UserID
        const meResponse = await fetch("https://api.mercadopago.com/users/me", {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });

        if (!meResponse.ok) {
            return NextResponse.json({ available_amount: 0, unavailable_total_amount: 0, error: "Invalid Token" });
        }

        const meData = await meResponse.json();
        const userId = meData.id;

        // 2. Try Fetching Balance API (Standard)
        const balanceRes = await fetch(`https://api.mercadopago.com/users/${userId}/mercadopago_account/balance`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });

        if (balanceRes.ok) {
            return NextResponse.json(await balanceRes.json());
        }

        // 3. Fallback: Manual Calculation if 403 (FORBIDDEN)
        console.warn("[MP] Balance API Forbidden. Calculating manually via Payment Search...");

        // Search last 1000 approved payments
        const searchUrl = new URL("https://api.mercadopago.com/v1/payments/search");
        searchUrl.searchParams.set("status", "approved");
        searchUrl.searchParams.set("limit", "100"); // Start with 100 for performance
        searchUrl.searchParams.set("sort", "date_created");
        searchUrl.searchParams.set("criteria", "desc");

        const searchRes = await fetch(searchUrl.toString(), {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });

        if (!searchRes.ok) {
            return NextResponse.json({ available_amount: 0, unavailable_total_amount: 0, error: "API Search Error" });
        }

        const searchData = await searchRes.json();
        const payments = searchData.results || [];
        const now = new Date();

        let available = 0;
        let pending = 0;

        // Estimate Net amount (MP fees are roughly 6-7% total)
        const FEE_ESTIMATE = 0.935; // 6.5% fee

        payments.forEach((p: any) => {
            const amount = (p.transaction_amount || 0) * FEE_ESTIMATE;
            const releaseDateStr = p.money_release_date;

            if (releaseDateStr) {
                const releaseDate = new Date(releaseDateStr);
                if (releaseDate > now) {
                    pending += amount;
                } else {
                    // Only count as "available" if it's relatively recent or we assume it hasn't been withdrawn
                    // This is an estimate.
                    available += amount;
                }
            } else {
                available += amount;
            }
        });

        return NextResponse.json({
            available_amount: available,
            unavailable_total_amount: pending,
            total_amount: available + pending,
            is_estimated: true
        });

    } catch (error) {
        console.error("[MP] Balance Route Crash:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
