import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db/client'
import '@/lib/auth/types'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp:   { label: 'OTP',   type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null

        const users = await prisma.$queryRawUnsafe<Array<{ id: string; phone: string; role: string }>>(
          `SELECT id, phone, role FROM users WHERE phone = $1 AND "isActive" = true LIMIT 1`,
          credentials.phone
        )
        if (!users || users.length === 0) return null
        const user = users[0]

        const sessions = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
          `SELECT id FROM sessions WHERE "userId" = $1 AND token = $2 AND "expiresAt" > NOW() LIMIT 1`,
          user.id, credentials.otp
        )
        if (!sessions || sessions.length === 0) return null

        await prisma.$executeRawUnsafe(`DELETE FROM sessions WHERE id = $1`, sessions[0].id)

        return {
          id:    user.id,
          phone: user.phone,
          role:  user.role as 'ARTESANO' | 'CLIENTE' | 'ADMIN',
          name:  user.phone,
          email: null,
          image: null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id    = user.id
        token.phone = (user as { phone: string }).phone
        token.role  = (user as { role: 'ARTESANO' | 'CLIENTE' | 'ADMIN' }).role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id    = token.id as string
      session.user.phone = token.phone as string
      session.user.role  = token.role as 'ARTESANO' | 'CLIENTE' | 'ADMIN'
      return session
    },
  },
}
