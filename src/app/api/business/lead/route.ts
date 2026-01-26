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
                <div style="font-family: 'Segoe UI', user-select: none; Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; padding: 40px 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        
                        <!-- Header -->
                        <div style="background-color: #0B0F19; padding: 40px 20px; text-align: center; border-bottom: 2px solid #5D5CDE;">
                            <img src="https://auroracademy.net/logo-full.png" alt="Aurora Academy" style="height: 50px; width: auto; display: block; margin: 0 auto;" />
                        </div>

                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                            <h2 style="color: #111827; margin-top: 0; margin-bottom: 16px; font-size: 24px; text-align: center;">¡Gracias por contactarnos!</h2>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                                Hola <strong>${name}</strong>,
                            </p>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
                                Hemos recibido correctamente tu solicitud de presupuesto para <strong>${companyName}</strong>. 
                            </p>
                            
                            <div style="background-color: #f3f4f6; border-left: 4px solid #5D5CDE; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                                <p style="margin: 0; color: #1f2937; font-size: 15px;">
                                    Un especialista de nuestro equipo de Educación Corporativa analizará tus requerimientos y se pondrá en contacto contigo en las próximas <strong>24 horas hábiles</strong>.
                                </p>
                            </div>

                            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 40px;">
                                Atentamente,<br/>
                                <strong>El equipo de Aurora Academy</strong>
                            </p>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                                © ${new Date().getFullYear()} Aurora Academy. Todos los derechos reservados.
                            </p>
                        </div>
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
