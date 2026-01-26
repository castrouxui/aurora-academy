
import fs from 'fs';
import path from 'path';

const to = 'castrouxui@gmail.com';
const subject = '¡Bienvenido al Plan Inversor Inicial! - Aurora Academy';
const html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  h1 { color: #333; }
  .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
</style>
</head>
<body>
<div class="container">
    <h1>¡Suscripción Activada!</h1>
    <p>Hola José,</p>
    <p>Tu suscripción <strong>Inversor Inicial</strong> ha sido activada exitosamente.</p>
    <p>Ahora tenés acceso ilimitado a todos los cursos y beneficios de tu plan.</p>
    <p>Podés acceder a tu contenido exclusivo desde tu panel de control.</p>
    <a href="https://auroracademy.net/dashboard" class="button">Ir a mi Panel</a>
    <p style="margin-top: 30px; font-size: 12px; color: #888;">Gracias por confiar en Aurora Academy.</p>
</div>
</body>
</html>`;

const outputPath = path.resolve(process.cwd(), 'email-preview.html');

fs.writeFileSync(outputPath, html);

console.log(`✅ SIMULATION SUCCESS: Email content generated for ${to}`);
console.log(`📂 Preview saved to: ${outputPath}`);
console.log(`----- Subject: ${subject} -----`);
