# Dashboard — Sistema de gestión

Panel de administración de inventario y ventas con tablas, gráficas y alertas de stock bajo. Construido con Next.js, Prisma, Recharts y Tailwind CSS.

## Características

- **Dashboard con KPIs**: ingresos, ticket promedio, unidades vendidas, pedidos pendientes y alertas de stock bajo.
- **Gráficas (Recharts)**: ventas por día (últimos 30 días), ventas por categoría, top productos y pedidos por estado.
- **Inventario**: tabla de productos con búsqueda (nombre/SKU), filtros por categoría y estado de stock, ordenamiento y paginación. Badge de estado (disponible / stock bajo / agotado).
- **Ventas**: tabla de pedidos con búsqueda (cliente/correo/ID), filtro por estado y ordenamiento por total/fecha.
- **Roles**: `ADMIN` y `VIEWER` (solo lectura, con banner de aviso). `/admin` (usuarios) exclusivo de administradores.
- **Exportación**: CSV del inventario y de las ventas (respeta los filtros activos) y reporte PDF (pdf-lib) con resumen, inventario y últimos pedidos.
- **Autenticación**: Auth.js v5 con credenciales, rol en JWT y protección de rutas vía middleware.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Prisma 7 + PostgreSQL (Neon)
- Auth.js v5 (next-auth) con roles en JWT
- Recharts para gráficas
- pdf-lib para exportación PDF
- Zod para validación de filtros
- Vitest + Testing Library para tests unitarios

## Requisitos

- Node.js 22+
- Base de datos PostgreSQL (ej. Neon)

## Configuración

1. Clonar el repositorio e instalar dependencias:

   ```bash
   npm ci
   ```

2. Crear el archivo `.env.local` (ver `.env.example`):

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/dashboard"
   DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST/dashboard?sslmode=require"
   AUTH_SECRET="generar-con: openssl rand -hex 32"
   APP_URL="https://dashboard.vercel.app"
   ```

3. Aplicar migraciones y sembrar datos de ejemplo:

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

4. Ejecutar en desarrollo:

   ```bash
   npm run dev
   ```

## Usuarios de prueba

| Rol     | Email                 | Password      |
| ------- | --------------------- | ------------- |
| Admin   | `admin@dashboard.cl`  | `admin1234`   |
| Viewer  | `viewer@dashboard.cl` | `viewer1234`  |

## Scripts

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run start        # producción
npm run lint         # eslint
npm test             # tests unitarios (vitest)
npm run db:migrate   # prisma migrate dev
npm run db:seed      # prisma db seed
npm run db:studio    # prisma studio
```

## CI

GitHub Actions ejecuta lint, tests, build, migraciones y seed en cada push a `main` y pull request.

## Deploy

Desplegado en Vercel con PostgreSQL en Neon.
