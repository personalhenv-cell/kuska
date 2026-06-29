'use client'

import Link from 'next/link'
import Image from 'next/image'
import Kusi from '@/components/ui/Kusi'
import AllyLogo from '@/components/ui/AllyLogo'
import { ALLIES_STRIP } from '@/lib/data/allies'
import { useLanguage } from '@/contexts/LanguageContext'

const NAV = [
  { title: 'Plataforma', links: [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/registro',    label: 'Vender' },
    { href: '/alianzas',    label: 'Alianzas' },
  ]},
  { title: 'Comunidad', links: [
    { href: '/registro', label: 'Soy artesano' },
    { href: '/login',    label: 'Ingresar' },
  ]},
]

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-24" style={{ background: '#3D1C02', color: '#F5F0E8' }}>
      {/* Tira de aliados */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F5F0E8]/50">{t('footer.support')}</span>
          {ALLIES_STRIP.map(a => (
            <Link key={a.slug} href="/alianzas" aria-label={a.name}>
              <AllyLogo ally={a} mode="strip" />
            </Link>
          ))}
        </div>
      </div>

      {/* Cuerpo */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.png" alt="Kuska" width={44} height={44} className="rounded-xl" />
            <span className="font-display font-bold text-2xl">Kuska</span>
          </div>
          <p className="text-sm text-[#F5F0E8]/65 max-w-xs leading-relaxed">
            {t('hero.tagline')}
          </p>
          <div className="mt-5">
            <Kusi size="sm" animation="idle" />
          </div>
        </div>

        {NAV.map(col => (
          <div key={col.title}>
            <h4 className="font-bold text-sm mb-3 text-[#F0B429]">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#F5F0E8]/70 hover:text-[#F5F0E8] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright + apoyo */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#F5F0E8]/50">© {year} Kuska · Hecho con orgullo en el Perú 🇵🇪</p>
          <p className="text-xs text-[#F5F0E8]/40 text-center">
            Con el apoyo de: Scale · Wichay Continental · ProInnóvate · BCP · Intercorp · Grupo Romero
          </p>
        </div>
      </div>
    </footer>
  )
}
