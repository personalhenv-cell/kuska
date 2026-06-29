# PHASES.md — Fases de construcción de Kuska

Estado: ✅ hecho · 🟡 en progreso · ⬜ pendiente

---

## ✅ FASE 0 — Setup inicial
- [x] Proyecto Next.js 14.2.5 (App Router, TS strict, Tailwind)
- [x] Assets movidos a `/public` y `/public/alianzas`
- [x] Dependencias base instaladas
- [x] `.env.example` + `.gitignore` (`.env.local` nunca se commitea)
- [x] `CLAUDE.md`, `DESIGN.md`, `PHASES.md`
- [x] `next.config.js` con headers de seguridad

## ✅ FASE 1 — Foundation técnica
- [x] `prisma/schema.prisma` completo (30+ modelos)
- [x] `src/lib/prisma.ts` (singleton)
- [x] `src/lib/utils.ts` (`cn`, `formatPrice`, `formatDate`, helpers)
- [x] `src/auth/config.ts` (NextAuth v4, OTP, RAW SQL)
- [x] `src/middleware.ts` (protección de rutas por rol)
- [x] `src/types/next-auth.d.ts`
- [x] `/api/health` → `{status, db}`
- [x] `/api/auth/[...nextauth]`, `/api/auth/send-otp`, `/api/auth/verify-otp`
- [ ] Ejecutar `prisma db push` contra Neon (requiere red a la DB)
- [ ] Seed de datos demo

## ✅ FASE 2 — Sistema de diseño
- [x] `tailwind.config.ts` (paleta, fuentes, animaciones Kusi)
- [x] `globals.css` (CSS vars, liquid glass, keyframes, skeleton, textura andina)
- [x] Fuentes Playfair + Inter + Nunito (`next/font`)
- [x] `<Kusi />` (7 animaciones)
- [x] `<Button />`, `<Input />`, `<Badge />`, `<SkeletonCard />`
- [x] `<LoadingScreen />` (7s)
- [x] `<AndeanDivider />` (patrón inca SVG)
- [x] `<Navbar />`, `<Footer />`
- [x] `LanguageContext` + `<LanguageToggle />` (ES/QU/EN)

## ✅ FASE 3 — Landing page
- [x] Hero andino con Kusi + frases quechua
- [x] Sección "¿Qué es Kuska?" asimétrica
- [x] "Cómo funciona" 3 pasos
- [x] Stats / impacto
- [x] Alianzas (logos)
- [x] CTA final + dividers andinos
- [x] SEO metadata + Open Graph
- [ ] Mapa interactivo Perú (Leaflet) — pendiente
- [ ] Hero parallax GSAP ScrollTrigger — pendiente (versión Framer entregada)

---

## ⬜ FASE 4 — Auth + Registro (UI multi-paso)
## ⬜ FASE 5 — Marketplace
## ⬜ FASE 6 — Checkout y pagos (simulados)
## ⬜ FASE 7 — Dashboard artesano
## ⬜ FASE 8 — Dashboard cliente
## ⬜ FASE 9 — Módulos IA (streaming Claude)
## ⬜ FASE 10 — Integraciones (Resend, Mux, OneSignal, Sentry, GA4, PWA)
## ⬜ FASE 11 — Admin + módulos extra
## ⬜ FASE 12 — Polish final y verificación

> Las fases 4–12 están planificadas en detalle en el prompt maestro v8.0.
> Cada fase debe cerrar con `npm run build` en 0 errores antes de avanzar.
