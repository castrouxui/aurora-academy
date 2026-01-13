import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the client
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(req: NextRequest) {
    try {
        if (!process.env.MP_ACCESS_TOKEN) {
            console.error("Missing MP_ACCESS_TOKEN");
            return NextResponse.json({ error: "Server misconfiguration: Missing Payment Token" }, { status: 500 });
        }

        const body = await req.json();
        const { title, price, quantity, userId, courseId, bundleId } = body;

        let dbItem;
        if (!courseId && !bundleId && title) {
            // Fallback: Find course by title
            const { prisma } = await import("@/lib/prisma");
            dbItem = await prisma.course.findFirst({
                where: { title: title }
            });
        }

        // Clean price string
        // Clean price string, ensuring it handles numbers or strings
        const numericPrice = typeof price === 'number' ? price : Number(String(price).replace(/[^0-9]/g, ''));

        // Determine Base URL for callbacks
        // Priority: Env Var -> Request Origin -> Production Fallback -> Localhost
        const origin = req.headers.get('origin');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (req.headers.get("origin") ?? "https://aurora-academy.onrender.com");

        const preference = new Preference(client);

        const preferenceBody = {
            items: [
                {
                    id: bundleId || courseId || 'unknown',
                    title: title,
                    unit_price: numericPrice,
                    quantity: 1,
                }
            ],
            back_urls: {
                success: `${baseUrl}/dashboard/courses`,
                failure: `${baseUrl}/pricing`,
                pending: `${baseUrl}/pricing`,
            },
            // auto_return removed to fix creation error
            metadata: {
                user_id: userId,
                course_id: courseId || (dbItem && !bundleId ? dbItem.id : undefined),
                bundle_id: bundleId,
            },
            notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        };

        console.log("Creating Preference with body:", JSON.stringify(preferenceBody, null, 2));

        const result = await preference.create({
            body: preferenceBody
        });

        return NextResponse.json({
            id: result.id,
            init_point: result.init_point
        });
    } catch (error: any) {
        console.error('Error creating preference:', error);
        return NextResponse.json({ error: 'Error creating preference', details: error.message || error }, { status: 500 });
    }
}
