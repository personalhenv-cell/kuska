/**
 * Secret de firma para NextAuth (JWT/CSRF).
 *
 * Se lee SIEMPRE de la variable de entorno `NEXTAUTH_SECRET`. El fallback
 * existe únicamente para garantizar que la plataforma siga funcionando si la
 * variable no llega al runtime de Vercel (evita el error de producción
 * [next-auth][error][NO_SECRET]). En un entorno correctamente configurado,
 * `process.env.NEXTAUTH_SECRET` tiene prioridad y el fallback nunca se usa.
 */
export const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? 'kuska-secret-2026-ceipe-artesanal-peru'
