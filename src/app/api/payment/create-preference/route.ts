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
        const { title, price, quantity, userId, courseId } = body;

        // Clean price string
        const numericPrice = Number(price.replace(/[^0-9]/g, ''));

        // Determine Base URL for callbacks
        // Priority: Env Var -> Request Origin -> Production Fallback -> Localhost
        const origin = req.headers.get('origin');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (req.headers.get("origin") ?? "https://aurora-academy.onrender.com");

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'course-id',
                        title: title,
                        unit_price: numericPrice,
                        quantity: 1,
                    }
                ],
                back_urls: {
                    success: `${baseUrl}/my-courses`,
                    failure: `${baseUrl}/my-courses`,
                    pending: `${baseUrl}/my-courses`,
                },
                auto_return: 'approved',
                metadata: {
                    user_id: userId,
                    course_id: courseId,
                },
                notification_url: `${baseUrl}/api/webhooks/mercadopago`,
            }
        });

        return NextResponse.json({ id: result.id });
    } catch (error: any) {
        console.error('Error creating preference:', error);
        return NextResponse.json({ error: 'Error creating preference', details: error.message || error }, { status: 500 });
    }
}
