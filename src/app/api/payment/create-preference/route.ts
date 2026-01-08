import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the client
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, price, quantity } = body;

        // Clean price string (remove symbols and dots) to number
        // Assuming price format like "$40.000" or similar
        const numericPrice = Number(price.replace(/[^0-9]/g, ''));

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'course-id', // dynamic in real app
                        title: title,
                        unit_price: numericPrice,
                        quantity: 1,
                    }
                ],
                // In production, use numericPrice. For testing, low value is better.
                // We will use the passed 'price' converted properly.
                // Note: MP Sandbox might fail with huge numbers if not configured correctly.
                // Let's assume we pass the real values.

                // Redirection URLs
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/courses`,
                    failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/courses`,
                    pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/courses`,
                },
                // auto_return: 'approved', // Commented out to prevent validation errors with localhost
            }
        });

        return NextResponse.json({ id: result.id });
    } catch (error: any) {
        console.error('Error creating preference:', error);
        return NextResponse.json({ error: 'Error creating preference', details: error.message || error }, { status: 500 });
    }
}
