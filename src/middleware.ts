import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { AUTH_SECRET } from '@/lib/auth/secret'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path  = req.nextUrl.pathname

    if (path.startsWith('/artesano') && token?.role !== 'ARTESANO' && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (path.startsWith('/cliente') && token?.role !== 'CLIENTE' && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  },
  {
    secret: AUTH_SECRET,
    callbacks: { authorized: ({ token }) => !!token },
  }
)

export const config = {
  matcher: ['/artesano/:path*', '/cliente/:path*', '/admin/:path*'],
}
