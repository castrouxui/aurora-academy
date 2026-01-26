import nodemailer from 'nodemailer';

/**
 * Standard Email Template Renderer
 * Includes Header with full Logo, Body, and Footer
 */
export const renderEmailTemplate = (contentHtml: string, previewText?: string) => {
    const year = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Aurora Academy</title>
    <style>
        :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
        }
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #f4f4f5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #101319;
            padding: 40px 20px;
            text-align: center;
            border-bottom: 2px solid #5D5CDE;
        }
        .logo {
            height: 50px;
            width: auto;
            display: block;
            margin: 0 auto;
        }
        .content {
            padding: 40px 30px;
            color: #111827;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            font-size: 12px;
            color: #9ca3af;
            margin: 0;
        }
        
        /* Dark Mode support */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #0B0F19 !important;
            }
            .container {
                background-color: #1a1a24 !important;
                border: 1px solid #333 !important;
            }
            .content {
                color: #e5e7eb !important;
            }
            .footer {
                background-color: #15151e !important;
                border-top: 1px solid #2d2d39 !important;
            }
            .footer-text {
                color: #6b7280 !important;
            }
        }
    </style>
</head>
<body>
    <div style="display: none; max-height: 0px; overflow: hidden;">
        ${previewText || ''}
    </div>
    <div style="padding: 40px 0;">
        <div class="container">
            <div class="header">
                <img src="https://auroracademy.net/logo-full.png" alt="Aurora Academy" class="logo" />
            </div>
            <div class="content">
                ${contentHtml}
            </div>
            <div class="footer">
                <p class="footer-text">
                    © ${year} Aurora Academy. Todos los derechos reservados.
                </p>
                <div style="margin-top: 10px;">
                    <a href="https://auroracademy.net" style="color: #5D5CDE; text-decoration: none; font-size: 12px; font-weight: bold;">auroracademy.net</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

export const sendEmail = async (to: string, subject: string, html: string, previewText?: string) => {
    const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

    if (!SMTP_EMAIL || !SMTP_PASSWORD) {
        console.error("SMTP Credentials missing");
        return false;
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD,
        },
    });

    // Wrap the HTML in our standard template
    const brandedHtml = renderEmailTemplate(html, previewText || subject);

    try {
        const info = await transporter.sendMail({
            from: `"Aurora Academy" <${SMTP_EMAIL}>`,
            to,
            subject,
            html: brandedHtml,
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
