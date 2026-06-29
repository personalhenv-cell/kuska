import Link from 'next/link'
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Kusi } from '@/components/ui/Kusi'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Crear cuenta' }

const opciones = [
  {
    href: '/registro/artesano',
    emoji: '🧶',
    title: 'Soy artesano',
    text: 'Vende tus creaciones, cuenta tu historia y haz crecer tu taller con herramientas de IA.',
    badge: 'Gratis para empezar',
    accent: 'hover:border-kuska-red/40',
  },
  {
    href: '/registro/cliente',
    emoji: '🛍️',
    title: 'Soy cliente',
    text: 'Descubre piezas únicas con historia, apoya a familias artesanas y colecciona arte peruano.',
    badge: 'Únete gratis',
    accent: 'hover:border-kuska-teal/40',
  },
]

export default function RegistroPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-kuska-cream px-6 pb-20 pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <Kusi size="lg" animation="wave" message="¿Cómo quieres unirte? 🦙" />
          <h1 className="mt-4 font-display text-h3 text-kuska-text sm:text-h2">
            Únete a Kuska
          </h1>
          <p className="mt-3 font-body text-lg text-kuska-text-mid">
            Elige cómo quieres ser parte de la comunidad artesanal del Perú.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {opciones.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className={`group rounded-glass border border-kuska-border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${o.accent}`}
            >
              <span className="text-5xl">{o.emoji}</span>
              <div className="mt-4">
                <Badge variant="technique">{o.badge}</Badge>
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold text-kuska-text">
                {o.title}
              </h2>
              <p className="mt-2 font-body text-kuska-text-mid">{o.text}</p>
              <span className="mt-4 inline-block font-body font-semibold text-kuska-red">
                Continuar →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center font-body text-sm text-kuska-text-mid">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-semibold text-kuska-red">
            Ingresa aquí
          </Link>
        </p>
      </main>
      <Footer />
    </>
  )
}
