'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const MENU = [
  { icon: '🏠', label: 'Dashboard',     href: '/artesano/dashboard' },
  { icon: '📦', label: 'Mis productos', href: '/artesano/productos' },
  { icon: '🌿', label: 'Módulo Raíces', href: '/artesano/raices' },
  { icon: '📊', label: 'CFO-bot IA',    href: '/artesano/cfo' },
  { icon: '🎓', label: 'Academia',      href: '/artesano/academia' },
  { icon: '🏆', label: 'Capitalización',href: '/artesano/scoring' },
  { icon: '🎪', label: 'Ferias',        href: '/artesano/ferias' },
  { icon: '🎓', label: 'Talleres',      href: '/artesano/talleres' },
  { icon: '💬', label: 'Cuéntame',      href: '/artesano/comunidad' },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router  = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [active, setActive] = useState('/artesano/dashboard')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== 'ARTESANO') {
      router.push('/marketplace')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
        <div className="flex flex-col items-center gap-4">
          <Image src="/images/logo.jpeg" alt="Kuska" width={60} height={60} className="rounded-xl animate-pulse" />
          <p className="text-[#3D1C02]/60 text-sm">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#3D1C02] flex flex-col transition-all duration-300 ease-in-out fixed h-full z-30`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <Image src="/images/logo.jpeg" alt="Kuska" width={36} height={36} className="rounded-xl flex-shrink-0" />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'serif' }}>Kuska</p>
              <p className="text-white/40 text-xs">Panel artesano</p>
            </div>
          )}
        </div>

        {/* Menú */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {MENU.map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setActive(item.href)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl mb-1 transition-all duration-200 group ${
                active === item.href
                  ? 'bg-[#C84B2F] text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Usuario */}
        <div className="border-t border-white/10 p-4">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-white text-sm font-medium truncate">{session?.user?.name || 'Artesano'}</p>
              <p className="text-white/40 text-xs truncate">{session?.user?.phone}</p>
            </div>
          )}
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs w-full">
            <span>🚪</span>
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>

        {/* Toggle sidebar */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-[#C84B2F] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg hover:bg-[#A83A22] transition-colors">
          {sidebarOpen ? '←' : '→'}
        </button>
      </aside>

      {/* Contenido principal */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 p-6`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#3D1C02]" style={{ fontFamily: 'serif' }}>
              ¡Hola, {session?.user?.name?.split(' ')[0] || 'artesano'}! 👋
            </h1>
            <p className="text-[#3D1C02]/50 text-sm mt-1">Bienvenido a tu panel de Kuska</p>
          </div>
          <Link href="/artesano/productos/nuevo"
            className="flex items-center gap-2 px-4 py-2 bg-[#C84B2F] text-white font-semibold rounded-xl hover:bg-[#A83A22] transition-all hover:scale-105 text-sm shadow-lg">
            <span>+</span> Nuevo producto
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Productos',  value: '0', icon: '📦', color: 'bg-blue-50 text-blue-600' },
            { label: 'Ventas',     value: 'S/ 0', icon: '💰', color: 'bg-green-50 text-green-600' },
            { label: 'Visitas',    value: '0', icon: '👁️', color: 'bg-purple-50 text-purple-600' },
            { label: 'Valoración', value: '—', icon: '⭐', color: 'bg-amber-50 text-amber-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-[#3D1C02]/8 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-lg mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-[#3D1C02]">{stat.value}</p>
              <p className="text-xs text-[#3D1C02]/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/artesano/productos/nuevo"
            className="group bg-white rounded-2xl p-5 shadow-sm border border-[#3D1C02]/8 hover:border-[#C84B2F]/40 hover:shadow-md transition-all hover:-translate-y-1">
            <span className="text-3xl block mb-3">📦</span>
            <p className="font-bold text-[#3D1C02] group-hover:text-[#C84B2F] transition-colors">Subir producto</p>
            <p className="text-xs text-[#3D1C02]/50 mt-1">Agrega tus piezas al marketplace</p>
          </Link>
          <Link href="/artesano/raices"
            className="group bg-white rounded-2xl p-5 shadow-sm border border-[#3D1C02]/8 hover:border-[#2E7A6E]/40 hover:shadow-md transition-all hover:-translate-y-1">
            <span className="text-3xl block mb-3">🌿</span>
            <p className="font-bold text-[#3D1C02] group-hover:text-[#2E7A6E] transition-colors">Módulo Raíces</p>
            <p className="text-xs text-[#3D1C02]/50 mt-1">Cuenta la historia de tus piezas</p>
          </Link>
          <Link href="/artesano/cfo"
            className="group bg-white rounded-2xl p-5 shadow-sm border border-[#3D1C02]/8 hover:border-[#D4920A]/40 hover:shadow-md transition-all hover:-translate-y-1">
            <span className="text-3xl block mb-3">📊</span>
            <p className="font-bold text-[#3D1C02] group-hover:text-[#D4920A] transition-colors">CFO-bot IA</p>
            <p className="text-xs text-[#3D1C02]/50 mt-1">Consulta tu situación financiera</p>
          </Link>
        </div>

        {/* Estado de la cuenta */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3D1C02]/8">
          <h2 className="font-bold text-[#3D1C02] mb-4">Estado de tu cuenta</h2>
          <div className="space-y-3">
            {[
              { label: 'Identidad RENIEC', done: session?.user?.isVerified, action: '/registro' },
              { label: 'Foto de perfil',   done: false, action: '/artesano/perfil' },
              { label: 'Primer producto',  done: false, action: '/artesano/productos/nuevo' },
              { label: 'Historia Raíces',  done: false, action: '/artesano/raices' },
              { label: 'Plan Básico',      done: true,  action: null },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#3D1C02]/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    item.done ? 'bg-green-100 text-green-600' : 'bg-[#3D1C02]/10 text-[#3D1C02]/40'
                  }`}>
                    {item.done ? '✓' : '○'}
                  </span>
                  <span className="text-sm text-[#3D1C02]">{item.label}</span>
                </div>
                {!item.done && item.action && (
                  <Link href={item.action} className="text-xs text-[#C84B2F] hover:underline font-medium">
                    Completar →
                  </Link>
                )}
                {item.done && <span className="text-xs text-green-600 font-medium">✅ Listo</span>}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
