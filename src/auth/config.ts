import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { normalizePeruPhone } from '@/lib/utils'

type KuskaRole = 'artesano' | 'cliente' | 'admin'

interface AuthRow {
  id: string
  name: string
  phone: string
  role: KuskaRole
  artisan_profile_id: string | null
  is_entrepreneur: boolean | null
}

/**
 * NextAuth v4 — Login por OTP.
 *
 * NOTA: las tablas `sessions` y `otp_codes` se manipulan con RAW SQL por un bug
 * del adaptador Prisma con FK en Neon. Un solo statement por `$executeRawUnsafe`,
 * siempre con parámetros ($1, $2) — nunca concatenando strings.
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
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

        const rows = await prisma.$queryRawUnsafe<AuthRow[]>(
          `SELECT u.id, u.name, u.phone, u.role,
                  ap.id AS artisan_profile_id,
                  cp.is_entrepreneur
           FROM users u
           LEFT JOIN artisan_profiles ap ON ap.user_id = u.id
           LEFT JOIN client_profiles cp ON cp.user_id = u.id
           JOIN otp_codes o ON o.user_id = u.id
           WHERE u.phone = $1
             AND o.code = $2
             AND o.expires_at > NOW()
             AND o.used = false
           ORDER BY o.created_at DESC
           LIMIT 1`,
          phone,
          credentials.otp,
        )

        if (!rows || rows.length === 0) return null
        const row = rows[0]

        // Marcar el OTP como usado — statement separado.
        await prisma.$executeRawUnsafe(
          `UPDATE otp_codes SET used = true WHERE code = $1 AND user_id = $2`,
          credentials.otp,
          row.id,
        )

        return {
          id: row.id,
          name: row.name,
          phone: row.phone,
          role: row.role,
          artisan_profile_id: row.artisan_profile_id ?? null,
          is_entrepreneur: row.is_entrepreneur ?? false,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.role = user.role
        token.artisan_profile_id = user.artisan_profile_id
        token.is_entrepreneur = user.is_entrepreneur
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.phone = token.phone
      session.user.role = token.role
      session.user.artisan_profile_id = token.artisan_profile_id
      session.user.is_entrepreneur = token.is_entrepreneur
      return session
    },
  },
}
