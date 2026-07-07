'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Logo } from '@/components/ui/Logo'
import { Icon, type IconName } from '@/components/ui/Icon'
import type { Session } from 'next-auth'

type User = Session['user']

const navItems: { href: string; label: string; icon: IconName; exact: boolean }[] = [
  { href: '/admin', label: 'Resumen', icon: 'dashboard', exact: true },
  { href: '/admin/usuarios', label: 'Usuarios', icon: 'users', exact: false },
  { href: '/admin/productos', label: 'Productos', icon: 'palette', exact: false },
  { href: '/admin/pedidos', label: 'Pedidos', icon: 'box', exact: false },
  { href: '/admin/academia', label: 'Academia', icon: 'academy', exact: false },
  { href: '/admin/ferias', label: 'Ferias Digitales', icon: 'tent', exact: false },
  { href: '/admin/capitalizacion', label: 'Capitalización', icon: 'wallet', exact: false },
]

export function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const isActive = (href: string, exact: boolean) => (exact ? pathname === href : pathname.startsWith(href))

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-kuska-border bg-white sticky top-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-kuska-border">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={32} variant="light" />
          <span className="font-display text-xl font-bold text-kuska-text">Kuska</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-b border-kuska-border">
        <div className="h-10 w-10 rounded-full bg-kuska-brown/15 flex items-center justify-center flex-shrink-0">
          <span className="font-display text-kuska-brown font-bold text-sm">
            {(user.name ?? 'A').charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-body font-semibold text-kuska-text text-sm truncate">{user.name}</p>
          <span className="font-nunito text-xs text-kuska-brown font-bold uppercase tracking-wide">Admin</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-btn font-body text-sm transition-all hover:translate-x-0.5 ${
              isActive(item.href, item.exact)
                ? 'bg-kuska-gold/15 text-kuska-brown font-semibold'
                : 'text-kuska-text-mid hover:bg-kuska-cream hover:text-kuska-text'
            }`}
          >
            <Icon name={item.icon} className="h-[18px] w-[18px] flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-kuska-border">
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
