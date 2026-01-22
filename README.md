# Aurora Academy

Plataforma educativa para cursos on-demand y membresías, con integración de pagos (Mercado Pago), gestión de contenidos y roles de usuario.

## 🚀 Cómo correr el proyecto en otra computadora

Sigue estos pasos para configurar el entorno de desarrollo en una nueva máquina.

### 1. Requisitos Previos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [Git](https://git-scm.com/)

### 2. Clonar el repositorio

Si tienes el código en un repositorio (GitHub/GitLab):

```bash
git clone <url-del-repositorio>
cd aurora_academy
```

Si copiaste la carpeta manualmente, simplemente navega a ella en tu terminal.

### 3. Instalar Dependencias

Ejecuta el siguiente comando para descargar todas las librerías necesarias:

```bash
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo llamado `.env` en la raíz del proyecto (junto al `.env.local` si existe, o copia el ejemplo). Necesitarás las siguientes variables:

```env
# Base de Datos (PostgreSQL - NeonDB, Supabase, o Local)
DATABASE_URL="postgres://usuario:password@host:port/database"

# NextAuth (Autenticación)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu_secreto_super_seguro_generado_con_openssl"

# Integración Mercado Pago
MP_ACCESS_TOKEN="TEST-tu-access-token-de-mercado-pago"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# (Opcional) Google Auth si se usa
GOOGLE_CLIENT_ID="tu-client-id"
GOOGLE_CLIENT_SECRET="tu-client-secret"

# (Opcional) UploadThing para subida de archivos
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

### 5. Configurar la Base de Datos

Sincroniza el esquema de Prisma con tu base de datos:

```bash
npx prisma db push
```

*Nota: Esto creará las tablas necesarias en la base de datos configurada en `DATABASE_URL`.*

### 6. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🛠 Comandos Útiles

- `npm run dev`: Inicia servidor desarrollo.
- `npm run build`: Compila para producción.
- `npx prisma studio`: Abre interfaz visual para ver la base de datos.
- `npx prisma generate`: Regenera el cliente de base de datos si cambias el schema.

## 📁 Estructura del Proyecto

- `/src/app`: Rutas del frontend (Next.js App Router).
- `/src/components`: Componentes reutilizables.
- `/src/lib`: Utilidades y configuraciones (Prisma, Utils).
- `/prisma`: Schema de base de datos.
