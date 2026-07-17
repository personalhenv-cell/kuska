import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { normalizePeruPhone } from '@/lib/utils'

type KuskaRole = 'artesano' | 'cliente' | 'admin'

interface AuthRow {
  id: string
  name: string
  nickname: string | null
  phone: string
  role: KuskaRole
  avatar_url: string | null
  artisan_profile_id: string | null
  is_entrepreneur: boolean | null
}

interface ActiveOtpRow {
  id: string
  code: string
  attempts: number
}

const MAX_OTP_ATTEMPTS = 5

/**
 * NextAuth v4 — Login por OTP.
 *
 * NOTA: las tablas `sessions` y `otp_codes` se manipulan con RAW SQL por un bug
 * del adaptador Prisma con FK en Neon. Un solo statement por `$executeRawUnsafe`,
 * siempre con parámetros ($1, $2) — nunca concatenando strings.
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  // maxAge explícito de 30 días para que "Mantener sesión iniciada" (checkbox
  // del login) sea real: la cookie JWT persiste entre cierres del navegador.
  // Quien NO quiera persistencia lo desmarca y el RememberSessionGuard cierra
  // su sesión al abrir el navegador en una nueva sesión (ver Providers).
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  pages: { signIn: '/login', error: '/auth/error' },
  providers: [
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        phone: { label: 'Teléfono', type: 'text' },
        otp: { label: 'Código OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null

        const phone = normalizePeruPhone(credentials.phone)
        if (!phone) return null

        const userRows = await prisma.$queryRawUnsafe<{ id: string }[]>(
          `SELECT id FROM users WHERE phone = $1 LIMIT 1`,
          phone,
        )
        if (!userRows || userRows.length === 0) return null
        const userId = userRows[0].id

        // El OTP más reciente vigente para este usuario, sin importar si el
        // código coincide — así podemos limitar intentos (fuerza bruta sobre
        // un código de 6 dígitos en 5 min) independientemente de si acertó.
        const activeOtp = await prisma.$queryRawUnsafe<ActiveOtpRow[]>(
          `SELECT id, code, attempts FROM otp_codes
           WHERE user_id = $1 AND expires_at > NOW() AND used = false
           ORDER BY created_at DESC LIMIT 1`,
          userId,
        )
        if (!activeOtp || activeOtp.length === 0) return null
        const otp = activeOtp[0]

        if (otp.attempts >= MAX_OTP_ATTEMPTS) return null

        if (otp.code !== credentials.otp) {
          await prisma.$executeRawUnsafe(
            `UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1`,
            otp.id,
          )
          return null
        }

        const rows = await prisma.$queryRawUnsafe<AuthRow[]>(
          `SELECT u.id, u.name, u.nickname, u.phone, u.role, u.avatar_url,
                  ap.id AS artisan_profile_id,
                  cp.is_entrepreneur
           FROM users u
           LEFT JOIN artisan_profiles ap ON ap.user_id = u.id
           LEFT JOIN client_profiles cp ON cp.user_id = u.id
           WHERE u.id = $1`,
          userId,
        )
        if (!rows || rows.length === 0) return null
        const row = rows[0]

        // Marcar el OTP como usado — statement separado.
        await prisma.$executeRawUnsafe(
          `UPDATE otp_codes SET used = true WHERE id = $1`,
          otp.id,
        )

        return {
          id: row.id,
          // El apodo, si el usuario puso uno, reemplaza el nombre real en
          // toda la plataforma (header, dashboards, comunidad) reusando el
          // mismo campo `name` que NextAuth ya propaga a session.user.name.
          name: row.nickname || row.name,
          nickname: row.nickname ?? null,
          phone: row.phone,
          role: row.role,
          // NextAuth mapea user.image → token.picture → session.user.image;
          // sin esto los sidebars nunca mostraban la foto del usuario.
          image: row.avatar_url,
          artisan_profile_id: row.artisan_profile_id ?? null,
          is_entrepreneur: row.is_entrepreneur ?? false,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.role = user.role
        token.artisan_profile_id = user.artisan_profile_id
        token.is_entrepreneur = user.is_entrepreneur
        token.nickname = user.nickname
      }
      // Permite refrescar is_entrepreneur sin re-login: el cliente llama a
      // useSession().update({ is_entrepreneur }) justo después de guardar su
      // perfil — si no, el toggle quedaría "guardado" en la DB pero invisible
      // en la sesión activa hasta el próximo login.
      if (trigger === 'update' && session?.is_entrepreneur !== undefined) {
        token.is_entrepreneur = session.is_entrepreneur
      }
      // Mismo mecanismo para la foto de perfil: AvatarUploader llama a
      // useSession().update({ image }) justo después de subir la nueva foto
      // a Vercel Blob — sin esto, el header/sidebar seguirían mostrando el
      // avatar viejo hasta el próximo login aunque la DB ya esté actualizada.
      if (trigger === 'update' && typeof session?.image === 'string') {
        token.picture = session.image
      }
      // Mismo mecanismo para el apodo: el formulario de perfil llama a
      // useSession().update({ nickname }) justo después de guardarlo, y
      // como `name` se deriva del apodo, actualizamos ambos a la vez.
      if (trigger === 'update' && 'nickname' in (session ?? {})) {
        token.nickname = session.nickname
        token.name = session.nickname || token.name
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.phone = token.phone
      session.user.role = token.role
      session.user.artisan_profile_id = token.artisan_profile_id
      session.user.is_entrepreneur = token.is_entrepreneur
      session.user.nickname = token.nickname
      return session
    },
  },
}
