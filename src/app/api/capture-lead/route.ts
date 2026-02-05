import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

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

        // 2. Auto-responder Email Content
        const subject = "🚀 Tu acceso: El camino del inversor";

        // Simple, premium HTML content as requested
        // Using inline styles for email compatibility, though renderEmailTemplate handles structure.
        const htmlContent = `
            <div style="font-family: sans-serif; color: #111827;">
                <h2 style="color: #5D5CDE; margin-bottom: 24px;">¡Bienvenido/a a Aurora Academy!</h2>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                    Has tomado una excelente decisión al no irte con las manos vacías.
                </p>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    Tal como prometí, aquí tienes tu acceso exclusivo a <strong>"El camino del inversor"</strong>. 
                    Este material está diseñado para transformar tu perspectiva sobre las finanzas y la inversión.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="https://auroracademy.net/curso-gratuito" 
                       style="background-color: #5D5CDE; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                        Acceder al Curso Gratuito
                    </a>
                </div>
                <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">
                    Nos vemos dentro,<br>
                    <strong>Fran Castro</strong>
                </p>
            </div>
        `;

        // 3. Send Email
        // sendEmail(to, subject, html, previewText)
        const success = await sendEmail(
            email,
            subject,
            htmlContent,
            "Tu acceso gratuito a 'El camino del inversor' está aquí."
        );

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
