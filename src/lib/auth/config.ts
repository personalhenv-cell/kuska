import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db/client'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        phone: { label: 'Teléfono', type: 'tel' },
        otp:   { label: 'Código OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null

        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
          include: {
            artisanProfile: true,
            clientProfile:  true,
            identity:       true,
          },
        })

        if (!user || !user.isActive) return null

        const session = await prisma.session.findFirst({
          where: {
            userId:    user.id,
            token:     credentials.otp,
            expiresAt: { gt: new Date() },
          },
        })

        if (!session) return null

        await prisma.session.delete({ where: { id: session.id } })

        return {
          id:            user.id,
          phone:         user.phone,
          role:          user.role,
          preferredLang: user.preferredLang,
          isVerified:    user.identity?.reniecStatus === 'VERIFIED',
          profileId:     user.artisanProfile?.id || user.clientProfile?.id || null,
          name:          user.artisanProfile?.displayName || user.clientProfile?.displayName || null,
          email:         user.email,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id            = user.id
        token.phone         = (user as any).phone
        token.role          = (user as any).role
        token.preferredLang = (user as any).preferredLang
        token.isVerified    = (user as any).isVerified
        token.profileId     = (user as any).profileId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id            = token.id as string
        session.user.phone         = token.phone as string
        session.user.role          = token.role as string
        session.user.preferredLang = token.preferredLang as string
        session.user.isVerified    = token.isVerified as boolean
        session.user.profileId     = token.profileId as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60,
  },

  secret: process.env.AUTH_SECRET,
}
