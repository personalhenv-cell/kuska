'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Kusi } from '@/components/ui/Kusi'
import { Logo } from '@/components/ui/Logo'
import type { Session } from 'next-auth'

type User = Session['user']

const navItems = [
  { href: '/dashboard/artesano', label: 'Inicio', icon: '🏠', exact: true },
  { href: '/dashboard/artesano/productos', label: 'Mis productos', icon: '🎨', exact: false },
  { href: '/dashboard/artesano/pedidos', label: 'Pedidos', icon: '📦', exact: false },
  { href: '/dashboard/artesano/mensajes', label: 'Mensajes', icon: '💬', exact: false },
  { href: '/dashboard/artesano/estadisticas', label: 'Estadísticas', icon: '📊', exact: false },
  { href: '/dashboard/artesano/raices', label: 'Raíces', icon: '🌳', exact: false },
  { href: '/dashboard/artesano/academia', label: 'Academia', icon: '🎓', exact: false },
  { href: '/dashboard/artesano/ferias', label: 'Ferias Digitales', icon: '🎪', exact: false },
  { href: '/dashboard/artesano/agrupacion', label: 'Red Agrupación', icon: '👥', exact: false },
  { href: '/dashboard/artesano/comunidad', label: 'Red Cuéntame', icon: '🗣️', exact: false },
  { href: '/dashboard/artesano/cfo-bot', label: 'CFO-Bot IA', icon: '🤖', exact: false },
  { href: '/dashboard/artesano/match-ia', label: 'Match IA', icon: '🤝', exact: false },
  { href: '/dashboard/artesano/capitalizacion', label: 'Capitalización', icon: '💰', exact: false },
  { href: '/dashboard/artesano/perfil', label: 'Mi perfil', icon: '👤', exact: false },
]

export function ArtisanSidebar({ user }: { user: User }) {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-kuska-border bg-white sticky top-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-kuska-border">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={32} variant="light" />
          <span className="font-display text-xl font-bold text-kuska-text">Kuska</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-b border-kuska-border">
        <div className="h-10 w-10 rounded-full bg-kuska-teal/20 flex items-center justify-center flex-shrink-0">
          {user.image ? (
            <Image src={user.image} alt={user.name ?? ''} width={40} height={40} className="rounded-full object-cover" />
          ) : (
            <span className="font-display text-kuska-teal font-bold text-sm">
              {(user.name ?? 'A').charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-body font-semibold text-kuska-text text-sm truncate">{user.name}</p>
          <span className="font-nunito text-xs text-kuska-teal font-bold uppercase tracking-wide">Artesano</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-btn font-body text-sm transition-all ${
              isActive(item.href, item.exact)
                ? 'bg-kuska-gold/15 text-kuska-brown font-semibold'
                : 'text-kuska-text-mid hover:bg-kuska-cream hover:text-kuska-text'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-kuska-border space-y-3">
        <Kusi size="sm" animation="idle" message="¡Hoy es un gran día! 🦙" />
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full text-left px-3 py-2 rounded-btn font-body text-sm text-kuska-text-mid hover:bg-kuska-cream hover:text-kuska-red transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
