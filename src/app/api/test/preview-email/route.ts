import { NextResponse } from "next/server";
import { membershipOfferEmail } from "@/lib/emails/membershipOffer";

export async function GET() {
    const { html } = membershipOfferEmail("Francisco");
    return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
    });
}
