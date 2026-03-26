export function membershipOfferEmail(userName: string) {
    const firstName = userName?.split(" ")[0] || "Inversor";

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Seguí aprendiendo con Aurora Academy</title>
</head>
<body style="margin:0;padding:0;background:#0B0F19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e5e7eb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F19;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <img src="https://auroracademy.net/logo-new.png" alt="Aurora Academy" height="28" style="height:28px;width:auto;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#0D1120;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px 36px;">

              <!-- Saludo -->
              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Para ${firstName}</p>
              <h1 style="margin:0 0 16px;font-size:26px;font-weight:900;color:#ffffff;line-height:1.2;">
                Ya completaste tus primeras lecciones. ¿Qué sigue?
              </h1>
              <p style="margin:0 0 28px;font-size:16px;color:#9ca3af;line-height:1.6;">
                Estás avanzando bien en <strong style="color:#fff;">El Camino del Inversor</strong>.
                Pero esto es solo el comienzo — el verdadero progreso viene cuando tenés acceso al sistema completo.
              </p>

              <!-- Separator -->
              <div style="border-top:1px solid rgba(255,255,255,0.06);margin-bottom:28px;"></div>

              <!-- Beneficios -->
              <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Con una membresía Aurora accedés a</p>
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                <tr><td style="padding:6px 0;font-size:15px;color:#d1d5db;">✅ &nbsp;+26 cursos de trading e inversión</td></tr>
                <tr><td style="padding:6px 0;font-size:15px;color:#d1d5db;">✅ &nbsp;Canal privado de Telegram con Fran Castro</td></tr>
                <tr><td style="padding:6px 0;font-size:15px;color:#d1d5db;">✅ &nbsp;1 curso nuevo cada 15 días</td></tr>
                <tr><td style="padding:6px 0;font-size:15px;color:#d1d5db;">✅ &nbsp;Garantía de 7 días — devolvemos el 100%</td></tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://auroracademy.net/membresias"
                       style="display:inline-block;background:#5D5CDE;color:#ffffff;font-weight:800;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:10px;letter-spacing:0.02em;">
                      Ver planes y precios →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Precio referencia -->
              <p style="margin:20px 0 0;text-align:center;font-size:13px;color:#6b7280;">
                Planes desde <strong style="color:#9ca3af;">$54.900/mes</strong> · Cancelás cuando quieras
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:#4b5563;">
                Recibís este mail porque completaste lecciones en Aurora Academy.<br/>
                <a href="https://auroracademy.net" style="color:#6b7280;">auroracademy.net</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = `
Hola ${firstName},

Ya completaste tus primeras lecciones en El Camino del Inversor. ¡Buen comienzo!

Con una membresía Aurora accedés a:
- +26 cursos de trading e inversión
- Canal privado de Telegram con Fran Castro
- 1 curso nuevo cada 15 días
- Garantía de 7 días

Ver planes: https://auroracademy.net/membresias

—
Aurora Academy
`;

    return { html, text, subject: "Seguís avanzando — esto es lo que te espera en Aurora 🚀" };
}
