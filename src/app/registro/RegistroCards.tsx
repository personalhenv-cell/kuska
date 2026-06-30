'use client'

import Link from 'next/link'

const OPCIONES = [
  {
    href: '/registro/artesano',
    emoji: '🧶',
    title: 'Soy artesano',
    text: 'Vende tus creaciones, cuenta tu historia y haz crecer tu taller con herramientas de IA.',
    badge: 'Gratis para empezar',
    accentColor: 'rgba(200,75,47,0.35)',
    hoverShadow: '0 0 24px rgba(200,75,47,0.2)',
  },
  {
    href: '/registro/cliente',
    emoji: '🛍️',
    title: 'Soy cliente',
    text: 'Descubre piezas únicas con historia, apoya a familias artesanas y colecciona arte peruano.',
    badge: 'Únete gratis',
    accentColor: 'rgba(46,122,110,0.35)',
    hoverShadow: '0 0 24px rgba(46,122,110,0.2)',
  },
]

export function RegistroCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {OPCIONES.map((o) => (
        <Link
          key={o.href}
          href={o.href}
          className="group block rounded-[24px] p-7 transition-all duration-300 hover:-translate-y-1.5"
          style={{
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(40px) saturate(160%)',
            WebkitBackdropFilter: 'blur(40px) saturate(160%)',
            border: `1px solid ${o.accentColor}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 16px 40px rgba(0,0,0,0.4), ${o.hoverShadow}`
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
          }}
        >
          <span className="text-5xl">{o.emoji}</span>
          <div className="mt-3 inline-block">
            <span
              className="rounded-full px-3 py-1 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold"
              style={{ background: 'rgba(212,146,10,0.15)', border: '1px solid rgba(212,146,10,0.3)' }}
            >
              {o.badge}
            </span>
          </div>
          <h2 className="mt-3 font-display text-xl font-bold text-kuska-cream">
            {o.title}
          </h2>
          <p className="mt-2 font-body text-sm text-kuska-cream/65 leading-relaxed">{o.text}</p>
          <span className="mt-4 inline-block font-body text-sm font-semibold text-kuska-gold transition-all group-hover:translate-x-1">
            Continuar →
          </span>
        </Link>
      ))}
    </div>
  )
}
