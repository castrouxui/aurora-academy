import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, companyName, email, phone, employees } = body;

        if (!name || !companyName || !email) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        await prisma.lead.create({
            data: {
                name,
                companyName,
                email,
                phone: phone || null,
                employees: employees || "Unknown",
            }
        });

        // Trigger Notification Email (Future TODO: Use Resend/SendGrid)
        console.log(`[NEW LEAD] ${name} from ${companyName} (${email}) - ${employees} employees.`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[LEAD_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
