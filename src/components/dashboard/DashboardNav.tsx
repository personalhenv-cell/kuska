'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Kusi } from '@/components/ui/Kusi'
import { Logo } from '@/components/ui/Logo'
import { Icon, type IconName } from '@/components/ui/Icon'
import type { Session } from 'next-auth'

type User = Session['user']

export interface DashNavItem {
  href: string
  label: string
  icon: IconName
  exact?: boolean
  /** Marca el módulo como parte de Kuska IA (badge dorado "IA"). */
  ia?: boolean
}

export interface DashNavSection {
  title?: string
  items: DashNavItem[]
}

interface DashboardNavProps {
  user: User
  roleLabel: string
  accent: 'teal' | 'red'
  kusiMessage: string
  sections: DashNavSection[]
}

const ACCENT_TEXT = { teal: 'text-kuska-teal', red: 'text-kuska-red' } as const
const ACCENT_BG = { teal: 'bg-kuska-teal/15', red: 'bg-kuska-red/15' } as const

function NavLinks({
  sections,
  pathname,
  onNavigate,
}: {
  sections: DashNavSection[]
  pathname: string
  onNavigate?: () => void
}) {
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
      {sections.map((section, i) => (
        <div key={section.title ?? `s${i}`}>
          {section.title && (
            <p className="mb-1 px-3 font-nunito text-[10px] font-bold uppercase tracking-widest text-kuska-text-mid/60">
              {section.title}
            </p>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-btn px-3 py-2.5 font-body text-sm transition-all ${
                  isActive(item.href, item.exact)
                    ? 'bg-kuska-gold/15 font-semibold text-kuska-brown'
                    : 'text-kuska-text-mid hover:bg-kuska-cream hover:text-kuska-text'
                }`}
              >
                <Icon name={item.icon} className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.ia && (
                  <span className="flex-shrink-0 rounded-full bg-kuska-gold/20 px-1.5 py-0.5 font-nunito text-[9px] font-bold uppercase tracking-wide text-kuska-gold">
                    IA
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function UserHeader({ user, roleLabel, accent }: { user: User; roleLabel: string; accent: 'teal' | 'red' }) {
  return (
    <div className="flex items-center gap-3 border-b border-kuska-border px-6 py-4">
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${ACCENT_BG[accent]}`}>
        {user.image ? (
          <Image src={user.image} alt={user.name ?? ''} width={40} height={40} className="rounded-full object-cover" />
        ) : (
          <span className={`font-display text-sm font-bold ${ACCENT_TEXT[accent]}`}>
            {(user.name ?? '?').charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate font-body text-sm font-semibold text-kuska-text">{user.name}</p>
        <span className={`font-nunito text-xs font-bold uppercase tracking-wide ${ACCENT_TEXT[accent]}`}>
          {roleLabel}
        </span>
      </div>
    </div>
  )
}

export function DashboardNav({ user, roleLabel, accent, kusiMessage, sections }: DashboardNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Cierra el drawer al navegar y bloquea el scroll del body mientras está abierto.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const logoutButton = (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex w-full items-center gap-3 rounded-btn px-3 py-2 text-left font-body text-sm text-kuska-text-mid transition-colors hover:bg-kuska-cream hover:text-kuska-red"
    >
      <Icon name="logout" className="h-[18px] w-[18px]" />
      Cerrar sesión
    </button>
  )

  return (
    <>
      {/* ── Sidebar escritorio (≥ lg) ─────────────────────────────── */}
      <aside className="sticky top-0 hidden max-h-screen min-h-screen w-64 flex-col border-r border-kuska-border bg-white lg:flex">
        <div className="flex items-center gap-2 border-b border-kuska-border px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} variant="light" />
            <span className="font-display text-xl font-bold text-kuska-text">Kuska</span>
          </Link>
        </div>
        <UserHeader user={user} roleLabel={roleLabel} accent={accent} />
        <NavLinks sections={sections} pathname={pathname} />
        <div className="space-y-3 border-t border-kuska-border px-6 py-4">
          <Kusi size="sm" animation="idle" message={kusiMessage} />
          {logoutButton}
        </div>
      </aside>

      {/* ── Header móvil (< lg) ───────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-kuska-border bg-white px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} variant="light" />
          <span className="font-display text-lg font-bold text-kuska-text">Kuska</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className={`font-nunito text-[10px] font-bold uppercase tracking-wide ${ACCENT_TEXT[accent]}`}>
            {roleLabel}
          </span>
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menú de módulos"
            className="flex h-10 w-10 items-center justify-center rounded-btn text-kuska-text transition-colors hover:bg-kuska-cream"
          >
            <Icon name="menu" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* ── Drawer móvil ──────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-kuska-brown/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col bg-white shadow-2xl lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              role="dialog"
              aria-label="Menú de módulos"
            >
              <div className="flex items-center justify-between border-b border-kuska-border px-4 py-4">
                <div className="flex items-center gap-2">
                  <Logo size={28} variant="light" />
                  <span className="font-display text-lg font-bold text-kuska-text">Kuska</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="flex h-9 w-9 items-center justify-center rounded-btn text-kuska-text-mid transition-colors hover:bg-kuska-cream"
                >
                  <Icon name="close" className="h-5 w-5" />
                </button>
              </div>
              <UserHeader user={user} roleLabel={roleLabel} accent={accent} />
              <NavLinks sections={sections} pathname={pathname} onNavigate={() => setOpen(false)} />
              <div className="border-t border-kuska-border px-4 py-3">{logoutButton}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
