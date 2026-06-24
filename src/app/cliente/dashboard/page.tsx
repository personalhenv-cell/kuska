'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const MENU = [
  { icon: '🏠', label: 'Inicio',      href: '/cliente/dashboard' },
  { icon: '🛒', label: 'Marketplace', href: '/marketplace' },
  { icon: '📦', label: 'Mis pedidos', href: '/cliente/pedidos' },
  { icon: '❤️', label: 'Favoritos',   href: '/cliente/favoritos' },
  { icon: '🎪', label: 'Ferias',      href: '/cliente/ferias' },
]

export default function ClienteDashboardPage() {
  const session = useSession()
  const router  = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const sessionData   = session?.data
  const sessionStatus = session?.status

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') router.push('/login')
  }, [sessionStatus, router])

  if (sessionStatus === 'loading' || !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
        <div className="flex flex-col items-center gap-4">
          <Image src="/images/logo.jpeg" alt="Kuska" width={60} height={60} className="rounded-xl animate-pulse" />
          <p className="text-[#3D1C02]/60 text-sm">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#2E7A6E] flex flex-col transition-all duration-300 fixed h-full z-30`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <Image src="/images/logo.jpeg" alt="Kuska" width={36} height={36} className="rounded-xl flex-shrink-0" />
          {sidebarOpen && (
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'serif' }}>Kuska</p>
              <p className="text-white/40 text-xs">Panel cliente</p>
            </div>
          )}
        </div>
        <nav className="flex-1 py-4">
          {MENU.map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl mb-1 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200">
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-white text-sm font-medium truncate">{sessionData.user?.name || 'Cliente'}</p>
              <p className="text-white/40 text-xs truncate">{(sessionData.user as any)?.phone}</p>
            </div>
          )}
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs">
            <span>🚪</span>
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-[#2E7A6E] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg border border-white/20">
          {sidebarOpen ? '←' : '→'}
        </button>
      </aside>

      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 p-6`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#3D1C02]" style={{ fontFamily: 'serif' }}>
            ¡Hola, {sessionData.user?.name?.split(' ')[0] || 'viajero'}! 👋
          </h1>
          <p className="text-[#3D1C02]/50 text-sm mt-1">Descubre el arte artesanal del Perú</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pedidos realizados', value: '0', icon: '📦', color: 'bg-teal-50 text-teal-600' },
            { label: 'Favoritos',          value: '0', icon: '❤️', color: 'bg-pink-50 text-pink-600' },
            { label: 'Artesanos seguidos', value: '0', icon: '👤', color: 'bg-amber-50 text-amber-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-[#3D1C02]/8 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-lg mb-3`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-[#3D1C02]">{stat.value}</p>
              <p className="text-xs text-[#3D1C02]/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <Link href="/marketplace"
          className="block bg-gradient-to-br from-[#2E7A6E] to-[#1a5049] rounded-2xl p-6 text-white mb-6 hover:shadow-lg transition-all hover:-translate-y-0.5">
          <span className="text-4xl block mb-3">🛒</span>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'serif' }}>Explorar el marketplace</h2>
          <p className="text-white/70 text-sm">Descubre piezas únicas de los 25 departamentos del Perú</p>
        </Link>

        <h2 className="font-bold text-[#3D1C02] mb-4">Explorar por categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🧶', nombre: 'Textilería', href: '/marketplace?rubro=Textilería' },
            { icon: '🏺', nombre: 'Cerámica',   href: '/marketplace?rubro=Cerámica' },
            { icon: '💍', nombre: 'Joyería',    href: '/marketplace?rubro=Joyería' },
            { icon: '🪵', nombre: 'Madera',     href: '/marketplace?rubro=Madera' },
          ].map(cat => (
            <Link key={cat.nombre} href={cat.href}
              className="bg-white rounded-xl p-4 text-center shadow-sm border border-[#3D1C02]/8 hover:border-[#2E7A6E]/40 hover:shadow-md transition-all hover:-translate-y-0.5">
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <p className="text-xs font-semibold text-[#3D1C02]">{cat.nombre}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
