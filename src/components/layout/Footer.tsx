'use client'

import Link from 'next/link'
import { Kusi } from '@/components/ui/Kusi'
import { Logo } from '@/components/ui/Logo'

const columns = [
  {
    title: 'Plataforma',
    links: [
      { href: '/marketplace', label: 'Marketplace' },
      { href: '/comunidad', label: 'Comunidad' },
      { href: '/academia', label: 'Academia' },
      { href: '/precios', label: 'Membresías' },
    ],
  },
  {
    title: 'Artesanos',
    links: [
      { href: '/registro/artesano', label: 'Vende en Kuska' },
      { href: '/impacto', label: 'Impacto social' },
      { href: '/rutas', label: 'Rutas artesanales' },
      { href: '/biblioteca', label: 'Biblioteca cultural' },
    ],
  },
  {
    title: 'Kuska',
    links: [
      { href: '/alianzas', label: 'Alianzas' },
      { href: '/blog', label: 'Blog cultural' },
      { href: '/login', label: 'Ingresar' },
      { href: '/registro', label: 'Crear cuenta' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-kuska-brown text-kuska-cream">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo size={44} />
              <span className="font-display text-2xl font-bold">Kuska</span>
            </div>
            <p className="max-w-xs font-body text-sm text-kuska-cream/70">
              La primera plataforma nacional de innovación artesanal del Perú.
              Conectamos las manos que crean mundos.
            </p>
            <div className="pt-2">
              <Kusi size="sm" animation="sleep" />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-nunito text-sm font-bold uppercase tracking-wide text-kuska-gold">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-body text-sm text-kuska-cream/75 transition-colors hover:text-kuska-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="font-body text-xs text-kuska-cream/60">
            © {new Date().getFullYear()} Kuska · Hecho con 💛 en el Perú 🇵🇪
          </p>
          <p className="font-nunito text-xs text-kuska-cream/60">
            Kuska teqsimuyu — Juntos al mundo
          </p>
        </div>
        <p className="mt-4 text-center font-body text-xs text-kuska-cream/45">
          Creado por Agencia CEIPE
        </p>
      </div>
    </footer>
  )
}
