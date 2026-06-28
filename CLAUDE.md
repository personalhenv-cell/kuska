# CLAUDE.md — Kuska Platform

> Leído automáticamente por Claude Code en cada sesión.
> Fuente de verdad del proyecto. NO incluir secrets aquí — usar Vercel env vars.

---

## Identidad

**Kuska** — Primera plataforma nacional de innovación artesanal del Perú.
Conecta artesanos con clientes, capital, formación y mercados.

- **Repo:** github.com/personalhenv-cell/kuska
- **Producción:** kuska-cyan.vercel.app
- **Deadline crítico:** 6 Jul 2026 — presentación ante inversionistas
- **Equipo:** Agencia CEIPE (6 personas). Hendrick = CPO + Dev líder

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14.2.5 (App Router) |
| Lenguaje | TypeScript |
| ORM | Prisma 5.22.0 |
| Base de datos | PostgreSQL en Neon (21 tablas) |
| Auth | Auth.js v4 (next-auth) — OTP por SMS |
| Estilos | Tailwind CSS + Framer Motion |
| Deploy | Vercel (auto-deploy desde main) |
| Storage | Cloudinary (imágenes) |
| Pagos | Culqi / Yape (pendiente) |

## Variables de entorno

Todas en **Vercel → Settings → Environment Variables**. Nunca en el repo.

```
DATABASE_URL=        # Neon PostgreSQL connection string
DIRECT_URL=          # Neon direct URL
ANTHROPIC_API_KEY=   # Claude API para CFO-bot y Emprendedor IA
NEXTAUTH_SECRET=     # openssl rand -base64 32
NEXTAUTH_URL=        # https://kuska-cyan.vercel.app
CLOUDINARY_URL=      # Para subida de imágenes
```

---

## Identidad Visual

| Token | Hex |
|-------|-----|
| Brown | `#3D1C02` |
| Red | `#C84B2F` |
| Teal | `#2E7A6E` |
| Gold | `#D4920A` |
| Cream | `#F5F0E8` |

**Estética objetivo:** glassmorphism + 3D cards + parallax + smooth transitions (Framer Motion).

---

## Estado actual del repo

### ✅ YA FUNCIONA

```
src/app/api/auth/otp/route.ts          — OTP con raw SQL
src/app/api/auth/register/route.ts     — Registro 4 pasos
src/app/api/auth/[...nextauth]/route.ts — NextAuth
src/app/api/products/route.ts          — CRUD productos
src/app/api/products/mine/route.ts     — Mis productos
src/app/api/products/[slug]/route.ts   — Producto por slug
src/app/api/raices/route.ts            — Historias culturales
src/app/api/cfo/chat/route.ts          — CFO-bot streaming
src/app/api/identity/check/route.ts    — RENIEC demo
src/app/api/db/seed/route.ts           — Seed BD
src/lib/db/client.ts                   — Prisma singleton
src/app/providers.tsx                  — SessionProvider global
src/app/layout.tsx                     — Layout global
src/app/page.tsx                       — Home con loading + typewriter
src/app/login/page.tsx                 — Login OTP
src/app/registro/page.tsx              — Registro 4 pasos
src/app/marketplace/page.tsx           — Marketplace con filtros
src/app/marketplace/[slug]/page.tsx    — Detalle producto
src/app/artesano/dashboard/page.tsx    — Dashboard artesano + sidebar
src/app/artesano/productos/page.tsx    — Lista productos
src/app/artesano/productos/nuevo/page.tsx — Nuevo producto
src/app/artesano/raices/page.tsx       — Módulo Raíces (3 pasos)
src/app/artesano/cfo/page.tsx          — CFO-bot UI
src/app/cliente/dashboard/page.tsx     — Dashboard cliente
src/middleware.ts                      — Protección de rutas
prisma/schema.prisma                   — 21 tablas completas
```

### ❌ PENDIENTE CRÍTICO (en orden de prioridad)

1. **Fix `src/lib/auth/config.ts`** — usar `$queryRawUnsafe` para verificar OTP en sessions (FK issue)
2. **Loading screen** — SOLO al inicio y F5, nunca al cambiar de módulo
3. **Framer Motion** — smooth transitions entre páginas, instalar si no está
4. **Estética premium** — glassmorphism + 3D cards + parallax en homepage
5. **Cloudinary** — subida de fotos reales en productos y perfiles
6. **Marketplace** — conectar con productos reales de la BD
7. **Módulo Emprendedor IA** — guía de negocios con Claude API (streaming)
8. **Academia Kuska** — cursos y lecciones
9. **Ferias Digitales** — listado, filtros, participación
10. **Panel Admin** — stats, gestión usuarios/productos
11. **Membresías** — planes BASIC/PRO/COLLECTIVE con Culqi/Yape

---

## Reglas de código (CRÍTICAS)

1. **Código completo siempre** — nunca fragmentos, nunca `// TODO`, nunca `...rest`
2. **`$executeRawUnsafe` y `$queryRawUnsafe`** para operaciones en tabla `sessions` (tiene FK issue con Prisma)
3. **`next.config.js`** — siempre `.js`, nunca `.ts`
4. **Confirmar deploy en Vercel** antes de continuar al siguiente archivo
5. **Sin errores de TypeScript** — el build falla si hay type errors
6. **Tailwind únicamente** para estilos — no CSS modules
7. **Imports absolutos** desde `@/`
8. **Un archivo a la vez** — completarlo 100% antes de pasar al siguiente
9. **Framer Motion** para todas las animaciones de UI
10. **No tocar `prisma/schema.prisma`** sin migración aprobada

---

## Arquitectura de módulos (21 tablas en BD)

| Módulo | Tablas principales | Estado |
|--------|-------------------|--------|
| Auth / Usuarios | users, sessions, identity_verifications | ⚠️ Fix pendiente |
| Perfiles | artisan_profiles, client_profiles | ✅ |
| Marketplace | products, product_images, categories, reviews | ✅ API / ⚠️ UI |
| Raíces | heritage_stories, raices_media, linaje_cultural | ✅ |
| CFO-bot | cfo_conversations, financial_records | ✅ |
| Ferias | fairs, fair_participations | ❌ |
| Talleres | workshops, workshop_bookings | ❌ |
| Academia | academy_courses, academy_lessons, academy_progress | ❌ |
| Emprendedor IA | (usa Claude API, sin tabla propia) | ❌ |
| Capitalización | credit_scores, investment_offers | ❌ |
| Membresías | memberships | ❌ |
| Logística | community_hubs, deliveries | ❌ |
| Admin | (vistas sobre todas las tablas) | ❌ |
| Notificaciones | notifications | ❌ |
| Órdenes | orders, order_items | ❌ |

---

## Contexto operativo

- Hendrick trabaja desde PC (principal), Mac web y celular
- Flujo: prompt en claude.ai/code → Claude edita repo → Vercel auto-deploya
- Sin entorno local activo — validación en producción Vercel
- El CFO-bot y Emprendedor IA usan `ANTHROPIC_API_KEY` desde Vercel env vars
