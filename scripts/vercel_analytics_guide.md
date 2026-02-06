# Guía de Monitoreo: Vercel Analytics & Email Campaign

Esta guía explica cómo monitorear el impacto de la campaña de email masivo utilizando Vercel Analytics, que ya está integrado en la plataforma Aurora Academy.

## 1. Acceso al Dashboard
1. Ingresa a [vercel.com/dashboard](https://vercel.com/dashboard).
2. Selecciona el proyecto **Aurora Academy**.
3. Haz clic en la pestaña **Analytics**.

## 2. Filtrado de Tráfico de la Campaña
Como los links del email incluyen UTMs, podemos aislar el tráfico específico de esta acción.

En el dashboard de Analytics, busca la sección de filtros (usualmente arriba a la derecha o en las tablas de desglose) y aplica:

- **UTM Source**: `email`
- **UTM Campaign**: `lanzamiento_premium`
- **UTM Medium**: `campana_46k`

Esto te mostrará **solo** a los usuarios que vinieron desde el correo.

## 3. Métricas Clave

### Bounce Rate (Rebote)
El objetivo es reducir el 91%.
- En la pestaña **Overview** o **Pages**, observa la métrica **Bounce Rate** filtrada por la campaña.
- **Interpretación**: Un % alto significa que entran y se van sin interactuar. Un % bajo significa que navegan (van al checkout, ven cursos, etc.).

### Conversión (Estimada)
- Observa la ruta de navegación (Top Paths).
- Si ves mucho tráfico en `/membresias` pero poco en `/checkout` o `/gracias`, ahí está la fuga.

## 4. Validación en Tiempo Real
Cuando inicies el script `mailer.py`:
1. Ve a la pestaña **Realtime** en Vercel.
2. Deberías empezar a ver visitas con la fuente `email` a medida que la gente abre el correo (con un retraso natural).

---
**Nota**: El bounce rate de correos rebotados (emails inválidos) NO se ve en Vercel. Eso se gestiona automáticamente si el servidor SMTP de Hostinger devuelve errores, pero el script `mailer.py` no limpia la base de datos de correos inválidos automáticamente, solo loguea errores de envío si ocurren al momento de la conexión.
