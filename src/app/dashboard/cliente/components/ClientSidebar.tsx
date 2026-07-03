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
  { href: '/dashboard/cliente', label: 'Inicio', icon: '🏠', exact: true },
  { href: '/dashboard/cliente/pedidos', label: 'Mis pedidos', icon: '📦', exact: false },
  { href: '/dashboard/cliente/mensajes', label: 'Mensajes', icon: '💬', exact: false },
  { href: '/dashboard/cliente/favoritos', label: 'Favoritos', icon: '❤️', exact: false },
]

const entrepreneurItem = { href: '/dashboard/cliente/emprendedor', label: 'Emprendedor IA', icon: '🚀', exact: false }

export function ClientSidebar({ user }: { user: User }) {
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
        <div className="h-10 w-10 rounded-full bg-kuska-red/15 flex items-center justify-center flex-shrink-0">
          {user.image ? (
            <Image src={user.image} alt={user.name ?? ''} width={40} height={40} className="rounded-full object-cover" />
          ) : (
            <span className="font-display text-kuska-red font-bold text-sm">
              {(user.name ?? 'C').charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-body font-semibold text-kuska-text text-sm truncate">{user.name}</p>
          <span className="font-nunito text-xs text-kuska-red font-bold uppercase tracking-wide">Cliente</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {(user.is_entrepreneur ? [...navItems, entrepreneurItem] : navItems).map((item) => (
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
        <Link
          href="/marketplace"
          className="flex items-center gap-3 px-3 py-2.5 rounded-btn font-body text-sm text-kuska-text-mid hover:bg-kuska-cream hover:text-kuska-text transition-all"
        >
          <span className="text-base">🛍️</span>
          Explorar marketplace
        </Link>
      </nav>

      <div className="px-6 py-4 border-t border-kuska-border space-y-3">
        <Kusi size="sm" animation="idle" message="¡Gracias por apoyar el arte peruano! 🦙" />
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
