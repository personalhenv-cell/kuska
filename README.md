# Kuska 🇵🇪🦙

**Primera Plataforma Nacional de Innovación Artesanal del Perú.**
Marketplace + comunidad + academia + herramientas con IA para el artesano peruano.

- Producción: [kuska-cyan.vercel.app](https://kuska-cyan.vercel.app)
- Lee [`CLAUDE.md`](./CLAUDE.md), [`DESIGN.md`](./DESIGN.md) y [`PHASES.md`](./PHASES.md) antes de desarrollar.

## Stack

Next.js 14 (App Router) · TypeScript strict · Prisma + Neon PostgreSQL ·
NextAuth (OTP) · Tailwind + "Glassmorphism Andino" · Framer Motion · Anthropic Claude.

## Desarrollo

```bash
cp .env.example .env.local   # rellena los valores reales (no se commitea)
npm install
npm run dev                  # http://localhost:3000
```

## Base de datos

```bash
npx prisma db push           # sincroniza el schema con Neon
npx prisma db seed           # datos demo (5 artesanos, productos, badges, misiones)
```

> Nota: `db push` y `seed` requieren acceso TCP directo a Neon (puerto 5432).
> Ejecútalos desde Vercel, tu máquina local o un entorno con esa salida de red.

## Build

```bash
npm run build                # prisma generate + next build (0 errores)
```

## Estado del proyecto

Fases 0–3 completas (foundation, sistema de diseño, landing, auth UI por OTP).
Fases 4–12 (marketplace, dashboards, IA, integraciones, admin) planificadas en
`PHASES.md`.
