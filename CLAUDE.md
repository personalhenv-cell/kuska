# CLAUDE.md — Instrucciones maestras de desarrollo de Kuska

> Kuska — Primera Plataforma Nacional de Innovación Artesanal del Perú 🇵🇪🦙
> Lee este archivo al inicio de cada sesión, junto con `DESIGN.md` y `PHASES.md`.

## Qué es Kuska

Plataforma real (no demo) que conecta artesanos peruanos con clientes y
emprendedores. Marketplace + comunidad + academia + herramientas IA. Solo los
pagos son UI simulada; todo lo demás es funcional.

- **Repo:** github.com/personalhenv-cell/kuska
- **Producción:** kuska-cyan.vercel.app
- **Deadline demo inversionistas:** 6 de julio 2026

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14.2.5 (App Router, RSC) |
| Lenguaje | TypeScript `strict: true` — **nunca `any`** |
| ORM | Prisma 5.22.0 |
| DB | Neon PostgreSQL |
| Auth | Auth.js v4 (NextAuth) — **RAW SQL para `sessions` y `otp_codes`** |
| Estilos | Tailwind CSS + CSS custom properties |
| Animación | Framer Motion 11.3.8 (+ GSAP donde aplique) |
| IA | Google Gemini `gemini-2.5-flash` (streaming SSE, ver `src/lib/gemini.ts`). Marca visible al usuario: "Kuska IA" — sin nombrar el proveedor de backend en la UI. |
| Tiempo real | Pusher |
| Imágenes | Vercel Blob |
| Email | Resend · Video | Mux · Errores | Sentry · Push | OneSignal |

## Estructura del proyecto

```
src/
  app/            # rutas App Router (+ api/)
  auth/           # config NextAuth
  components/     # ui/ + layout/
  contexts/       # LanguageContext, etc.
  lib/            # prisma, utils
  types/          # tipos extendidos (next-auth.d.ts)
prisma/
  schema.prisma   # 30+ modelos
public/
  logo.png, kusi.png, alianzas/*.png
```

## Reglas de oro (no negociables)

1. **Fondo público SIEMPRE `cream` (#F5F0E8).** Nunca negro en páginas públicas.
2. **Nada genérico.** Cada componente debe sentirse específico de Kuska
   (ver `DESIGN.md`). Si parece template de Tailwind/shadcn → rediseñar.
3. **TypeScript estricto, sin `any`.** Tipa respuestas de API e interfaces.
4. **RAW SQL para `sessions`/`otp_codes`** (bug del adaptador Prisma con FK en
   Neon). **Un solo statement por `$executeRawUnsafe`.** Usa parámetros `$1, $2`
   — nunca concatenes strings en SQL.
5. **`next/image` siempre.** Nunca `<img>`.
6. **Imports dinámicos** (`ssr: false`) para librerías pesadas de cliente
   (GSAP, Leaflet, @react-pdf/renderer).
7. **Secrets solo en server.** Nunca `process.env` secreto en `'use client'`.
   Solo variables `NEXT_PUBLIC_*` en cliente.
8. **Validación Zod** en todas las API routes.
9. **Skeleton loaders**, nunca spinners blancos genéricos.
10. **`.env.local` jamás se commitea.** Usa `.env.example` como plantilla.

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # prisma generate + next build (debe dar 0 errores)
npm run lint         # eslint
npx prisma db push   # sincronizar schema con la DB
npx prisma db seed   # poblar datos demo
```

## Flujo de trabajo

- Desarrollar en la rama indicada por la sesión.
- `npm run build` debe pasar con **0 errores** antes de commitear.
- Commits descriptivos con prefijo `feat(fase-N): ...`.
- Avanzar fase por fase según `PHASES.md`.
