
import { sendCampaignEmail1 } from "@/functions/marketing";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    // Verify it's Vercel calling the cron
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await sendCampaignEmail1();
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("Cron Campaign 1 Error:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
