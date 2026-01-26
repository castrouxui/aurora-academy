
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { sendEmail } from './src/lib/email';

const to = 'castrouxui@gmail.com';
const subject = '¡Bienvenido al Plan Inversor Inicial! - Aurora Academy';
const html = `<h1>¡Suscripción Activada!</h1>
<p>Hola Usuario,</p>
<p>Tu suscripción <strong>Inversor Inicial</strong> está activa.</p>
<p>Ahora tenés acceso ilimitado a todos los cursos y beneficios de tu plan.</p>
<p>Accedé ahora: <a href="https://auroracademy.net/dashboard">Ir a mi Panel</a></p>`;

async function main() {
    console.log(`Sending email to: ${to}`);
    console.log(`Using SMTP_EMAIL: ${process.env.SMTP_EMAIL ? 'Set' : 'Not Set'}`);

    // Slight delay to ensure connection
    const success = await sendEmail(to, subject, html);

    if (success) {
        console.log('✅ Email sent successfully!');
    } else {
        console.error('❌ Failed to send email.');
        process.exit(1);
    }
}

main().catch(console.error);
