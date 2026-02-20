import { sendEmail } from './src/lib/email';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.production' });

async function main() {
    console.log('Sending test email to francastromt@hotmail.com...');
    const result = await sendEmail(
        'francastromt@hotmail.com',
        'Correo de prueba SMTP Directo',
        '<p>Este es un correo puramente de prueba para verificar la conexión SMTP con Hostinger hacia cuentas de Hotmail.</p>'
    );
    console.log('Send result:', result);
}

main().catch(console.error);
