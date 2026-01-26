import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, companyName, email, phone, employees } = body;

        if (!name || !companyName || !email) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Save to DB
        await prisma.lead.create({
            data: {
                name,
                companyName,
                email,
                phone: phone || null,
                employees: employees || "Unknown",
            }
        });

        // Email Content
        const subject = `🚀 Empresas - Cotización: ${companyName}`;
        const html = `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #5D5CDE; padding: 20px; text-align: center;">
                    <h2 style="color: white; margin: 0;">Nueva Solicitud Corporativa</h2>
                </div>
                <div style="padding: 24px;">
                    <p style="font-size: 16px; margin-bottom: 24px;">¡Hola! Has recibido una nueva solicitud de presupuesto para empresas.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Nombre de Contacto</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; text-align: right;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Empresa</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; text-align: right;">${companyName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Email</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; text-align: right;"><a href="mailto:${email}" style="color: #5D5CDE; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Teléfono</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; text-align: right;">${phone || '-'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Tamaño del Equipo</td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; text-align: right;">${employees}</td>
                        </tr>
                    </table>

                    <div style="text-align: center;">
                        <a href="mailto:${email}?subject=Propuesta%20Corporativa%20-%20Aurora%20Academy" style="background-color: #5D5CDE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Responder Ahora</a>
                    </div>
                </div>
                <div style="background-color: #f9fafb; padding: 12px; text-align: center; font-size: 12px; color: #9ca3af;">
                    Aurora Academy Leads System
                </div>
            </div>
        `;

        // Send Email to Admin (Self)
        // Note: Using SMTP_EMAIL as recipient ensures the admin receives it
        if (process.env.SMTP_EMAIL) {
            // 1. Send Notification to Admin
            await sendEmail(process.env.SMTP_EMAIL, subject, html);

            // 2. Send Confirmation to Client
            const clientSubject = `Recibimos tu solicitud - Aurora Academy`;
            const clientHtml = `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #f9f9f9;">
                    <div style="background-color: #5D5CDE; padding: 24px; text-align: center;">
                        <img src="https://auroracademy.net/logo-white.png" alt="Aurora Academy" style="height: 40px; margin-bottom: 10px;" />
                        <h2 style="color: white; margin: 0; font-size: 20px;">¡Gracias por contactarnos!</h2>
                    </div>
                    <div style="padding: 30px; background-color: white;">
                        <p style="font-size: 16px; margin-bottom: 16px;">Hola <strong>${name}</strong>,</p>
                        <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin-bottom: 24px;">
                            Hemos recibido tu solicitud de presupuesto para <strong>${companyName}</strong> correctamente.
                        </p>
                        <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin-bottom: 24px;">
                            Un especialista de nuestro equipo de Educación Corporativa analizará tus requerimientos y se pondrá en contacto contigo en las próximas <strong>24 horas hábiles</strong>.
                        </p>
                        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                        <p style="font-size: 14px; color: #6b7280; text-align: center;">
                            Si tienes alguna duda urgente, puedes responder a este correo.
                        </p>
                    </div>
                </div>
            `;

            try {
                await sendEmail(email, clientSubject, clientHtml);
            } catch (err) {
                console.error("Failed to send confirmation to client:", err);
                // We don't fail the request if client email fails, as long as admin got it.
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[LEAD_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
