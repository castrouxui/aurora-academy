
import { runEvergreenWorkflow } from "@/functions/marketing";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await runEvergreenWorkflow();
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("Cron Evergreen Error:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
