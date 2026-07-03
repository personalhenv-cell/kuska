'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { Kusi } from '@/components/ui/Kusi'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/marketplace', label: t('marketplace') },
    { href: '/talleres', label: 'Talleres' },
    { href: '/comunidad', label: t('community') },
    { href: '/academia', label: t('academy') },
    { href: '/#alianzas', label: 'Alianzas' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <nav
        className={cn(
          'liquid-glass-dark mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6',
          'transition-all duration-300',
          scrolled ? 'shadow-2xl' : '',
        )}
      >
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <Logo size={32} className="sm:!h-9 sm:!w-9" />
          <span className="truncate font-display text-base font-bold text-kuska-cream sm:text-xl">
            Kuska
          </span>
          <span className="hidden sm:block">
            <Kusi size="xs" animation="idle" />
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline font-body text-sm font-medium text-kuska-cream/85 transition-colors hover:text-kuska-gold"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden sm:block">
            <LanguageToggle dark />
          </span>
          <Link
            href="/login"
            className="hidden font-body text-sm font-semibold text-kuska-cream/85 hover:text-kuska-gold sm:block"
          >
            {t('login')}
          </Link>
          <Link
            href="/registro"
            className="whitespace-nowrap rounded-btn bg-kuska-gold px-3 py-2 font-body text-xs font-bold text-kuska-brown transition-transform hover:-translate-y-0.5 sm:px-4 sm:text-sm"
          >
            {t('register')}
          </Link>
        </div>
      </nav>
    </header>
  )
}
