import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

/**
 * Protección de rutas por rol (NextAuth v4).
 * - /admin            → solo admin
 * - /dashboard, etc.  → cualquier usuario autenticado
 */
export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const { pathname } = req.nextUrl

    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
    pages: { signIn: '/login' },
  },
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cliente/:path*',
    '/admin/:path*',
    '/checkout/:path*',
  ],
}
