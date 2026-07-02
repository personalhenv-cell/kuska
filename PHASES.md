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

## ✅ FASE 4 — Auth + Registro (UI multi-paso)
- [x] Login OTP con card glass centrada sobre fondo andino
- [x] Registro artesano (5 pasos) y cliente (4 pasos) con slide horizontal

## ✅ FASE 5 — Marketplace
- [x] Grid con filtros, búsqueda, favoritos, scroll infinito
- [x] Detalle de producto con galería, historia del artesano y reseñas

## ✅ FASE 6 — Checkout y pagos (simulados)
- [x] `POST /api/checkout` (Zod, transacción Order+OrderItem, stock, SolidarityFund)
- [x] `/checkout` un paso: Yape (QR animado), Plin, Visa (flip 3D), donación opcional
- [x] Éxito con Kusi celebrate + confetti
- [ ] Validar flujo completo contra la DB real en Vercel

## ✅ FASE 7 — Dashboard artesano
- [x] Inicio (stats, pedidos recientes, insignias, misiones), productos,
      pedidos, estadísticas (recharts), perfil editable (Server Action)
- [ ] Mensajes: placeholder — requiere chat en tiempo real (Fase 10/11)

## ✅ FASE 8 — Dashboard cliente
- [x] Sidebar, inicio (feed destacados), mis pedidos, favoritos

## ✅ MÓDULO 13 — Membresías
- [x] `src/lib/memberships.ts` — 5 planes (Semilla/Pro S/29/Maestro S/79 ·
      Explorador/Coleccionista S/19) + nombres de nivel de gamificación
      (Aprendiz → Leyenda, sistema independiente, no comprable)
- [x] `/precios` — página pública con toggle artesanos/clientes
- [x] `POST /api/membresias` — activación simulada, actualiza membership_tier
      y crea Subscription (30 días) para planes pagados
- [x] Plan y nivel visibles en los banners de ambos dashboards

## 🟡 FASE 9 — Módulos IA (streaming Claude)
- [x] src/lib/anthropic.ts — cliente singleton, modelo claude-sonnet-4-6
- [x] CFO-Bot IA (/dashboard/artesano/cfo-bot): chat con streaming real,
      contexto de ventas/stock/vistas real del artesano, gate Maestro
- [x] Descripciones de producto IA (/dashboard/artesano/productos/ia-descripcion):
      streaming, gate Pro+
- [ ] Emprendedor IA (plan de negocio en PDF) — módulo aparte, pendiente
- [ ] Match artesano-emprendedor vía IA (Maestro) — pendiente
## ⬜ FASE 10 — Integraciones (Resend, Mux, OneSignal, Sentry, GA4, PWA)
## ⬜ FASE 11 — Admin + módulos extra
## ⬜ FASE 12 — Polish final y verificación

> Las fases 4–12 están planificadas en detalle en el prompt maestro v8.0.
> Cada fase debe cerrar con `npm run build` en 0 errores antes de avanzar.
