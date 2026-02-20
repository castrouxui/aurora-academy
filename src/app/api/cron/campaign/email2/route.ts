
import { sendCampaignEmail2 } from "@/functions/marketing";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await sendCampaignEmail2();
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("Cron Campaign 2 Error:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
