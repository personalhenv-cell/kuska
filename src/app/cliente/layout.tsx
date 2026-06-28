'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { href: '/cliente/dashboard',    icon: '⊞', label: 'Dashboard' },
  { href: '/marketplace',          icon: '🏪', label: 'Marketplace' },
  { href: '/cliente/emprendedor',  icon: '🚀', label: 'IA Emprendedor' },
  { href: '/cliente/favoritos',    icon: '❤️', label: 'Favoritos' },
  { href: '/cliente/pedidos',      icon: '📦', label: 'Pedidos' },
  { href: '/cliente/perfil',       icon: '👤', label: 'Mi Perfil' },
]

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router   = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  if (status === 'loading' || !session) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0804' }}>
      <div className="text-[#F0EAE0]/30 text-sm">Cargando…</div>
    </div>
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0B0804' }}>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <aside className={`fixed md:sticky top-0 left-0 h-screen z-50 w-64 flex flex-col border-r border-[#F0EAE0]/[0.06] transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#070503' }}>
        <div className="p-5 border-b border-[#F0EAE0]/[0.06] flex items-center gap-3">
          <Image src="/logo.png" alt="Kuska" width={36} height={36} className="rounded-xl" />
          <div>
            <div className="text-[#F0EAE0] font-bold text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>Kuska</div>
            <div className="text-[#F0EAE0]/35 text-xs">Panel Emprendedor</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group"
                style={active ? { background: 'rgba(46,122,110,0.12)', color: '#2E7A6E' } : { color: 'rgba(240,234,224,0.45)' }}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span className={`font-medium ${active ? '' : 'group-hover:text-[#F0EAE0]/80'}`}>{item.label}</span>
                {active && <div className="ml-auto w-1 h-1 rounded-full bg-[#2E7A6E]" />}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-[#F0EAE0]/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2E7A6E]/20 flex items-center justify-center text-xs font-bold text-[#2E7A6E]">
              {session.user.phone?.slice(-2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#F0EAE0]/60 truncate">{session.user.phone}</div>
              <div className="text-[10px] text-[#2E7A6E] font-medium">Emprendedor</div>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/' })}
              className="btn-press p-1.5 text-[#F0EAE0]/30 hover:text-[#C84B2F] transition-colors duration-150 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#F0EAE0]/[0.06] glass-cream sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="btn-press p-2 text-[#F0EAE0]/60">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-[#F0EAE0] font-bold text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>Kuska</span>
          <div className="w-9" />
        </div>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
