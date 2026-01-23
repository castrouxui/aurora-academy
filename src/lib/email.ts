import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
    const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

    if (!SMTP_EMAIL || !SMTP_PASSWORD) {
        console.error("SMTP Credentials missing");
        return false;
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Aurora Academy" <${SMTP_EMAIL}>`,
            to,
            subject,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
