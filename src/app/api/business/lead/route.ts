import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, companyName, email, phone, employees, plan } = body;

        if (!name || !companyName || !email) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Save to DB
        // NOTE: We append plan to employees field to save it without schema migration for now
        await prisma.lead.create({
            data: {
                name,
                companyName,
                email,
                phone: phone || null,
                employees: `${employees || "Unknown"}${plan ? ` | Plan: ${plan}` : ""}`,
            }
        });

        // Email Content
        const subject = `🚀 Empresas - Cotización: ${companyName}`;
        const html = `
            <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 20px;">Nueva Solicitud Corporativa</h2>
            <p style="font-size: 16px; margin-bottom: 24px;">Has recibido una nueva solicitud de presupuesto para empresas.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); color: #6b7280; font-size: 14px;">Nombre</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 600; text-align: right;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); color: #6b7280; font-size: 14px;">Empresa</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 600; text-align: right;">${companyName}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); color: #6b7280; font-size: 14px;">Email</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 600; text-align: right;">${email}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); color: #6b7280; font-size: 14px;">Tamaño Equipo</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 600; text-align: right;">${employees}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); color: #6b7280; font-size: 14px;">Plan</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 600; text-align: right;">${plan || '-'}</td>
                </tr>
            </table>

            <div style="text-align: center; margin-top: 32px;">
                <a href="mailto:${email}?subject=Propuesta%20Corporativa" style="background-color: #5D5CDE; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Responder al Cliente</a>
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
                <h2 style="margin-top: 0; margin-bottom: 24px; font-size: 24px;">¡Gracias por contactarnos!</h2>
                
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    Hola <strong>${name}</strong>,
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    Hemos recibido correctamente tu solicitud de presupuesto${plan ? ` para el plan <strong>${plan}</strong>` : ''} en <strong>${companyName}</strong>. 
                </p>
                
                <div style="background-color: rgba(93, 92, 222, 0.05); border-left: 4px solid #5D5CDE; padding: 20px; margin-bottom: 24px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 15px; line-height: 1.5;">
                        Un especialista de nuestro equipo de Educación Corporativa analizará tus requerimientos y se pondrá en contacto contigo en las próximas <strong>24 horas hábiles</strong>.
                    </p>
                </div>

                <p style="font-size: 14px; margin-top: 40px; opacity: 0.8;">
                    Atentamente,<br/>
                    <strong>El equipo de Aurora Academy</strong>
                </p>
            `;

            try {
                await sendEmail(email, clientSubject, clientHtml, `Hola ${name}, recibimos tu solicitud de presupuesto.`);
            } catch (err) {
                console.error("Failed to send confirmation to client:", err);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[LEAD_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
