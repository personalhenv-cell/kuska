'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/ui/LanguageToggle'

const LINKS = [
  { href: '/marketplace', key: 'nav.marketplace' },
  { href: '/alianzas',    key: 'nav.alianzas' },
  { href: '/registro',    key: 'cta.sell' },
]

export default function Navbar() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-4 pt-3">
        <nav
          className={`mx-auto max-w-6xl flex items-center gap-4 px-4 sm:px-5 h-14 rounded-2xl transition-all duration-300 ${
            scrolled ? 'liquid-glass-dark' : ''
          }`}
          style={!scrolled ? { background: 'rgba(61,28,2,0.55)', backdropFilter: 'blur(16px)' } : undefined}
        >
          {/* Logo */}
          <Link href="/" className="btn-press flex items-center gap-2.5 shrink-0">
            <Image src="/logo.png" alt="Kuska" width={34} height={34} className="rounded-lg" priority />
            <span className="text-[#F5F0E8] font-display font-bold text-lg tracking-tight">Kuska</span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1 ml-2">
            {LINKS.map(l => {
              const active = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="btn-press px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{ color: active ? '#F0B429' : 'rgba(245,240,232,0.75)' }}
                >
                  {t(l.key)}
                </Link>
              )
            })}
          </div>

          <div className="flex-1" />

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle variant="dark" />
            <Link
              href="/login"
              className="btn-press px-3 py-1.5 rounded-lg text-sm font-semibold text-[#F5F0E8]/85 hover:text-[#F5F0E8] transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              href="/registro"
              className="btn-press px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors"
              style={{ background: '#C84B2F' }}
            >
              {t('nav.registro')}
            </Link>
          </div>

          {/* Hamburguesa móvil */}
          <button
            onClick={() => setOpen(v => !v)}
            className="btn-press md:hidden p-2 text-[#F5F0E8]"
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </nav>
      </header>

      {/* Panel móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={e => e.stopPropagation()}
              className="absolute top-20 inset-x-4 rounded-2xl p-4 liquid-glass-dark"
            >
              <div className="flex flex-col gap-1">
                {LINKS.map(l => (
                  <Link key={l.href} href={l.href} className="btn-press px-4 py-3 rounded-xl text-[#F5F0E8] font-medium hover:bg-white/5">
                    {t(l.key)}
                  </Link>
                ))}
                <div className="h-px my-2 bg-white/10" />
                <div className="flex items-center justify-between px-2">
                  <LanguageToggle variant="dark" />
                  <Link href="/login" className="btn-press px-3 py-2 text-[#F5F0E8]/85 font-semibold text-sm">{t('nav.login')}</Link>
                </div>
                <Link href="/registro" className="btn-press mt-2 px-4 py-3 rounded-xl text-center font-bold text-white" style={{ background: '#C84B2F' }}>
                  {t('nav.registro')}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
