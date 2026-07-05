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
- [x] Schema aplicado en Neon producción (34 tablas) — la DB nunca había
      tenido el schema; se aplicó vía HTTP driver + `@@map` corregido
      (ver Fase de verificación end-to-end abajo)
- [x] Seed de datos demo (5 artesanos + 11 productos + badges + misiones)

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
- [x] Mapa interactivo Perú (Leaflet): sección "Artesanos en cada rincón
      del país" con marcadores por región usando datos REALES de la DB
      (`/api/artesanos/mapa` agrupa artesanos por región), popup con
      nombres → perfil público y link al marketplace filtrado por región.
      Carga dinámica ssr:false (regla #6). Marcadores de marca Kuska.
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
- [x] Mensajes: chat real en tiempo real (Fase 10)

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
- [x] Emprendedor IA (/dashboard/cliente/emprendedor): streaming, gate
      is_entrepreneur=true, guarda en BusinessPlan, descarga PDF con
      @react-pdf/renderer (dinámico, ssr:false)
- [x] Match artesano-emprendedor vía IA (/dashboard/artesano/match-ia):
      streaming, gate Maestro, usa ClientProfile reales (is_entrepreneur)
## 🟡 FASE 10 — Integraciones (Resend, Mux, OneSignal, Sentry, GA4, PWA)
- [x] Pusher — chat en tiempo real (src/lib/pusher.ts, pusher-client.ts,
      /api/messages, /api/messages/conversations, /api/pusher/auth,
      Inbox + ChatWindow en ambos dashboards, entry point desde producto)
- [x] Resend — email de bienvenida (registro artesano/cliente)
- [ ] Mux — video para Módulo Raíces / Academia (bloqueado: falta
      `MUX_TOKEN_SECRET` en el entorno, solo está `MUX_TOKEN_ID`)
- [x] OneSignal — SDK web v16 inicializado (src/components/Integrations.tsx)
      con `NEXT_PUBLIC_ONESIGNAL_APP_ID` real; envío server-side de push
      queda pendiente de `ONESIGNAL_API_KEY` (no está en el entorno)
- [ ] Sentry — monitoreo de errores (bloqueado: no hay `SENTRY_DSN` ni
      `NEXT_PUBLIC_SENTRY_DSN` en el entorno)
- [x] GA4 — gtag.js real con `NEXT_PUBLIC_GA_ID`
- [x] PWA — manifest.ts (app/manifest.ts → /manifest.webmanifest),
      service worker real (public/sw.js: cache stale-while-revalidate +
      fallback offline.html), instalable
## ✅ FASE 11 — Admin + módulos extra
- [x] Panel de administración (`/admin`): resumen con stats reales,
      gestión de usuarios (activar/suspender), productos (publicar/
      ocultar), pedidos (solo lectura), academia y ferias (CRUD),
      capitalización (CRUD + revisión de postulaciones)
- [x] Crear producto real desde el dashboard del artesano (gap crítico
      encontrado y corregido — antes el dashboard era 100% solo
      lectura), con subida de imágenes vía Vercel Blob (bloqueado por
      configuración del store — ver arriba)
- [x] Módulo Raíces: historia completa, audio, galería, árbol
      genealógico (gated Pro+) + página pública `/artesano/[id]`
- [x] Academia Kuska: lecciones/artículos reales (BlogPost) creados
      desde `/admin/academia`, lectura gated Pro+
- [x] Ferias Digitales: CRUD admin, listado público `/ferias`,
      artesanos se unen con su stand desde el dashboard (gratis, todos
      los planes)
- [x] Red Cuéntame: feed social real (publicar, reaccionar, comentar),
      compartido entre ambos dashboards
- [x] Hub de Capitalización: convocatorias reales (gated Maestro),
      postulación + revisión de estado desde admin
- [x] Red Agrupación: grupos de artesanos + chat de grupo en tiempo
      real vía Pusher (gratis, todos los planes)
## ✅ MÓDULO Talleres (Workshop/WorkshopParticipant)
- [x] Gap real: el schema tenía Workshop + WorkshopParticipant con CERO UI.
- [x] API: POST/GET /api/talleres (crear taller — artesano; listar próximos),
      POST /api/talleres/[id]/inscribir (cupo + duplicado, cualquier usuario).
- [x] Público /talleres + /talleres/[id] (detalle + inscripción real).
- [x] Dashboard /dashboard/artesano/talleres (crear + ver inscritos), datos
      100% reales contra la DB.

## ✅ Enlaces rotos de navegación corregidos (bug real en producción)
- [x] Navbar apuntaba a /comunidad, /academia, /alianzas → los tres daban
      404. Creadas páginas públicas reales /academia (BlogPost publicados)
      y /comunidad (feed Red Cuéntame de solo lectura); /alianzas ahora
      ancla a la sección real de la landing (#alianzas).
- [x] Footer apuntaba a /impacto, /rutas, /biblioteca, /blog (todos 404) →
      repuntados a rutas reales (talleres, ferias, academia, comunidad).

## 🟡 FASE 12 — Polish final y verificación
- [x] Barrido de enlaces internos: todos los href estáticos resuelven a
      rutas reales (se corrigieron los 404 de Navbar/Footer, ver arriba).
- [x] Barrido HTTP en producción: todas las rutas públicas 200, las
      protegidas 307→login, las APIs públicas 200 — ningún 500.
- [x] Bug real corregido: el popup del mapa enlazaba con user.id en vez
      del id del ArtisanProfile (404) — ahora usa p.id, verificado en vivo.
- [x] Seed de contenido de demo idempotente listo (prisma/seed.ts):
      `npx prisma db seed` puebla talleres/ferias/academia/comunidad.
- [ ] Poblar el contenido de demo en producción (pendiente de decisión
      del usuario — escritura a la DB de producción).
- [ ] Hero parallax GSAP ScrollTrigger (opcional — versión Framer entregada).

## ✅ Verificación end-to-end en producción (kuska-cyan.vercel.app)
Prueba real completa: registro → email con OTP → login → dashboard,
chat Pusher y CFO-bot IA. Bugs reales encontrados y corregidos:
- **DB sin schema**: `prisma db push` nunca se había ejecutado contra
  Neon — las 34 tablas no existían. Aplicado directamente en producción.
- **Tablas huérfanas de un prototipo incompatible** (columnas camelCase,
  sin relación con el schema actual) ya existían en la misma DB —
  eliminadas (confirmado con el usuario antes de dropear).
- **Mismatch de nombres de tabla**: el schema no tenía `@@map`, así que
  Prisma usaba `"User"`/`"OtpCode"`/etc. (PascalCase) mientras el RAW SQL
  de `auth/config.ts` consultaba `users`/`otp_codes` (minúsculas) —
  nunca iban a coincidir. Se agregó `@@map` a los 4 modelos afectados.
- **OTP nunca se entregaba en producción**: `send-otp` solo devolvía
  `devCode` en desarrollo, sin ningún canal real. Se agregó email
  obligatorio al registro + entrega real vía Resend.
- **Middleware sin `secret`**: `withAuth()` no recibía `AUTH_SECRET`
  explícito, caía a `NEXTAUTH_SECRET` (no configurada) — el JWT se
  decodificaba bien en `/api/auth/session` pero el middleware fallaba,
  redirigiendo TODO `/dashboard/*`, `/checkout/*` y `/admin/*` a
  `/auth/error?error=Configuration`. Corregido.
- **Chat Pusher**: confirmado funcionando de punta a punta (mensaje real
  persistido, recuperable por ambos lados, trigger de Pusher sin error).
- **CFO-Bot IA**: código correcto y gate de membresía funcionando: el
  único bloqueo real es que la cuenta de Anthropic no tiene crédito
  (`credit balance too low`) — acción pendiente del usuario, no es bug.

### ⚠️ Pendiente de acción del usuario antes de la demo
1. **Anthropic**: agregar crédito/billing a la cuenta — CFO-bot y
   descripciones IA no funcionarán hasta entonces.
2. **Resend**: verificar un dominio propio en resend.com/domains. Hoy
   el remitente `onboarding@resend.dev` (modo prueba) solo puede enviar
   a la propia cuenta de Resend (`personalhenv@gmail.com`) — un
   inversionista real registrándose en vivo **no recibiría su código**
   hasta que se verifique un dominio.
3. **Vercel Blob en modo privado**: subir la foto de un producto real
   falla con `Cannot use public access on a private store`. El código
   del formulario de creación de producto (`/dashboard/artesano/productos/nuevo`)
   está correcto y probado — el token de subida se genera bien
   (`BLOB_READ_WRITE_TOKEN` configurado), pero el Store de Blob está
   configurado en modo privado en el dashboard de Vercel. Hay que
   cambiarlo a acceso público (Storage → el store de Blob → Settings)
   para que las fotos de producto sean visibles en el marketplace.

> Las fases 4–12 están planificadas en detalle en el prompt maestro v8.0.
> Cada fase debe cerrar con `npm run build` en 0 errores antes de avanzar.
