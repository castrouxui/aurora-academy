# Guía de Configuración de Google Login (OAuth)

Para que el login con Google funcione en producción (tu sitio en vivo), necesitas obtener dos claves especiales de Google (`Client ID` y `Client Secret`) y agregarlas a Render.

Sigue estos pasos detallados:

## Parte 1: Consola de Google Cloud

1.  Ve a [Google Cloud Console](https://console.cloud.google.com/).
2.  Inicia sesión con tu cuenta de Gmail.
3.  En la parte superior izquierda, haz clic en el selector de proyectos y selecciona **"New Project"** (Nuevo Proyecto).
    *   **Project Name:** `Aurora Academy`
    *   Haz clic en **Create**.
4.  Selecciona el proyecto recién creado en las notificaciones o el selector.

### Configurar Pantalla de Consentimiento (OAuth Consent Screen)

5.  En el menú lateral (hamburguesa), ve a **APIs & Services** > **OAuth consent screen**.
6.  Selecciona **User Type**: **External** (Externo) y dale a **Create**.
7.  **App Information**:
    *   **App name**: `Aurora Academy`
    *   **User support email**: Selecciona tu email.
    *   **Developer contact information**: Pon tu email nuevamente.
    *   Haz clic en **Save and Continue** (puedes saltar los pasos de "Scopes" y "Test Users" dándole a Continue hasta volver al Dashboard).
8.  **IMPORTANTE**: En la pantalla de resumen, haz clic en el botón **"PUBLISH APP"** (Publicar aplicación) para que funcione con cualquier email, no solo los de prueba. Confirma la publicación.

### Crear Credenciales

9.  En el menú lateral, ve a **APIs & Services** > **Credentials**.
10. Haz clic en **+ CREATE CREDENTIALS** > **OAuth client ID**.
11. **Application type**: Selecciona **Web application**.
12. **Name**: `Aurora Web` (o lo que quieras).
13. **Authorized JavaScript origins**:
    *   Haz clic en **ADD URI**.
    *   Pega la URL de tu sitio: `https://aurora-academy.onrender.com`
14. **Authorized redirect URIs** (¡Muy importante!):
    *   Haz clic en **ADD URI**.
    *   Pega exactamente esta URL: `https://aurora-academy.onrender.com/api/auth/callback/google`
15. Haz clic en **CREATE**.

¡Listo! Te aparecerá una ventana con "Your Client ID" y "Your Client Secret". **No cierres esta ventana o cópialos en un bloc de notas.**

---

## Parte 2: Configuración en Render

Ahora vamos a conectar esas claves con tu sitio.

1.  Ve a tu panel de control en [Render Dashboard](https://dashboard.render.com/).
2.  Entra a tu servicio web (`aurora-academy`).
3.  Haz clic en la pestaña **Environment** en el menú lateral izquierdo.
4.  Haz clic en **Add Environment Variable** para cada una de las siguientes:

| Variable | Valor (Lo que debes poner) |
| :--- | :--- |
| `GOOGLE_CLIENT_ID` | Pega el **Client ID** que copiaste de Google. |
| `GOOGLE_CLIENT_SECRET` | Pega el **Client Secret** que copiaste de Google. |
| `NEXTAUTH_URL` | `https://aurora-academy.onrender.com` |
| `NEXTAUTH_SECRET` | Usa el código secreto que te generará el asistente en el chat. |

5.  Haz clic en **Save Changes**.

Render reiniciará tu sitio automáticamente. Espera 1-2 minutos y prueba el botón de "Registrarse con Google" nuevamente. ¡Debería funcionar!
