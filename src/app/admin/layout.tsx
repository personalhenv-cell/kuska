'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV = [
  { href: '/admin/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/admin/usuarios',  icon: '👥', label: 'Usuarios' },
  { href: '/admin/productos', icon: '🏺', label: 'Productos' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session.user.role !== 'ADMIN') router.push('/')
  }, [status, session, router])

  if (status === 'loading' || !session || session.user.role !== 'ADMIN') {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0804' }}>
      <div className="text-[#F0EAE0]/30 text-sm">Cargando…</div>
    </div>
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0B0804' }}>
      <aside className="sticky top-0 h-screen w-60 flex flex-col border-r border-[#F0EAE0]/[0.06]" style={{ background: '#070503' }}>
        <div className="p-5 border-b border-[#F0EAE0]/[0.06] flex items-center gap-3">
          <Image src="/logo.png" alt="Kuska" width={32} height={32} className="rounded-xl" />
          <div>
            <div className="text-[#F0EAE0] font-bold text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>Kuska</div>
            <div className="text-[#C84B2F] text-xs font-medium">Admin</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={active ? { background: 'rgba(200,75,47,0.12)', color: '#C84B2F' } : { color: 'rgba(240,234,224,0.45)' }}>
                <span className="w-5 text-center">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-[#F0EAE0]/[0.06]">
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="btn-press w-full flex items-center gap-2 px-3 py-2.5 text-[#F0EAE0]/40 hover:text-[#C84B2F] text-sm transition-colors duration-150">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
