import { NextResponse } from 'next/server';
import { sendEmail, sendCourseWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name } = body;

        // 1. Validation
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // 3. Send Email
        const success = await sendCourseWelcomeEmail(email, name);

        if (!success) {
            console.error("Failed to send lead capture email to:", email);
            return NextResponse.json(
                { error: 'Failed to send confirmation email' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Lead captured successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in lead capture API:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
