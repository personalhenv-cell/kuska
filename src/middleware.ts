import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token    = req.nextauth.token
    const pathname = req.nextUrl.pathname

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const role = token.role as string

    if (pathname.startsWith('/artesano') && role !== 'ARTESANO') {
      return NextResponse.redirect(new URL('/marketplace', req.url))
    }

    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        const publicRoutes = ['/', '/marketplace', '/login', '/registro', '/api']
        if (publicRoutes.some(r => pathname.startsWith(r))) return true
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/artesano/:path*', '/cliente/:path*', '/admin/:path*'],
}
