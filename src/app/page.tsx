import Image from 'next/image'
import Link from 'next/link'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/landing/Hero'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import { AndeanDivider } from '@/components/AndeanDivider'
import { TiltCard } from '@/components/ui/TiltCard'
import { Counter } from '@/components/ui/Counter'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Kusi } from '@/components/ui/Kusi'
import { QueEsKuskaSection } from '@/components/landing/QueEsKuskaSection'

const pasos = [
  {
    n: '01',
    title: 'El artesano comparte su arte',
    text: 'Sube su colección, cuenta su historia y muestra la técnica heredada de generaciones.',
    color: 'text-kuska-red',
  },
  {
    n: '02',
    title: 'Kuska potencia su negocio',
    text: 'Herramientas con IA, academia, ferias digitales y acceso a fondos de capitalización.',
    color: 'text-kuska-gold',
  },
  {
    n: '03',
    title: 'El mundo descubre el Perú',
    text: 'Clientes y emprendedores compran piezas únicas con impacto social real y trazable.',
    color: 'text-kuska-teal',
  },
]

const artesanos = [
  {
    name: 'Rosa Quispe',
    region: 'Chinchero, Cusco',
    technique: 'Tejido en telar',
    emoji: '🧶',
  },
  {
    name: 'Julián Mamani',
    region: 'Pucará, Puno',
    technique: 'Cerámica',
    emoji: '🏺',
  },
  {
    name: 'Elena Huamán',
    region: 'Ayacucho',
    technique: 'Retablos',
    emoji: '🎨',
  },
]

const alianzas = [
  'scale',
  'wichay',
  'utec',
  'emprendeup',
  'proinnovate',
  'bcp',
  'intercorp',
  'romero',
  'wiese',
]

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="min-h-screen bg-kuska-cream">
        <Hero />

        <AndeanDivider />

        <FeatureGrid />

        <AndeanDivider />

        <QueEsKuskaSection />

        <AndeanDivider />

        {/* Cómo funciona — 3 pasos con línea conectora */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="technique" className="mb-4">
              Cómo funciona
            </Badge>
            <h2 className="font-display text-h3 text-kuska-text sm:text-h2">
              Tres pasos, un impacto que se siente
            </h2>
          </div>

          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            <div
              className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-kuska-red via-kuska-gold to-kuska-teal md:block"
              aria-hidden
            />
            {pasos.map((p) => (
              <div key={p.n} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-kuska-border bg-white shadow-sm">
                  <span className={`font-display text-xl font-bold ${p.color}`}>
                    {p.n}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-kuska-text">
                  {p.title}
                </h3>
                <p className="mt-2 font-body text-kuska-text-mid">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <AndeanDivider />

        {/* Artesanos destacados — 3D tilt */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge variant="new" className="mb-4">
                Maestros artesanos
              </Badge>
              <h2 className="font-display text-h3 text-kuska-text sm:text-h2">
                Manos que crean mundos
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="link-underline font-body font-semibold text-kuska-red"
            >
              Ver todos →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artesanos.map((a) => (
              <TiltCard key={a.name}>
                <article className="overflow-hidden rounded-card border border-kuska-border bg-white shadow-sm">
                  <div className="flex h-44 items-center justify-center bg-kuska-cream-dark">
                    <span className="text-6xl">{a.emoji}</span>
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="flex items-center gap-2">
                      <Badge variant="verified">✓ Verificado</Badge>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-kuska-text">
                      {a.name}
                    </h3>
                    <p className="font-body text-sm text-kuska-text-mid">
                      📍 {a.region}
                    </p>
                    <div className="pt-1">
                      <Badge variant="technique">{a.technique}</Badge>
                    </div>
                  </div>
                </article>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* Impacto — contadores */}
        <section className="bg-kuska-brown py-20 text-kuska-cream">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-h3 sm:text-h2">
                Impacto que se multiplica
              </h2>
              <p className="mt-3 font-body text-kuska-cream/70">
                Cada interacción en Kuska fortalece la economía artesanal del
                Perú.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {[
                { to: 1200, suffix: '+', label: 'Artesanos' },
                { to: 24, label: 'Regiones' },
                { to: 8500, suffix: '+', label: 'Piezas únicas' },
                { to: 95, suffix: '%', label: 'Va al artesano' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-4xl font-bold text-kuska-gold sm:text-5xl">
                    <Counter to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 font-nunito text-sm text-kuska-cream/75">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alianzas */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-center font-nunito text-sm font-bold uppercase tracking-wide text-kuska-text-mid">
            Respaldados por el ecosistema de innovación del Perú
          </p>
          <div className="mt-10 grid grid-cols-3 items-center gap-8 sm:grid-cols-3 md:grid-cols-5">
            {alianzas.map((logo) => (
              <div
                key={logo}
                className="flex items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
              >
                <Image
                  src={`/alianzas/${logo}.png`}
                  alt={logo}
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain opacity-80"
                />
              </div>
            ))}
          </div>
        </section>

        <AndeanDivider />

        {/* CTA final */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="liquid-glass-dark relative overflow-hidden rounded-glass px-8 py-14 text-center sm:px-16">
            <div className="andean-texture pointer-events-none absolute inset-0 opacity-[0.06]" />
            <div className="relative flex flex-col items-center gap-6">
              <Kusi size="lg" animation="celebrate" message="¡Únete a Kuska! 🦙" />
              <h2 className="font-display text-h3 text-kuska-cream sm:text-h2">
                Tu arte merece llegar más lejos
              </h2>
              <p className="max-w-xl font-body text-kuska-cream/75">
                Crea tu cuenta gratis y empieza a vender, aprender y crecer junto
                a una comunidad que cree en el talento peruano.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/registro/artesano">
                  <Button variant="primary" size="lg">
                    Empezar como artesano
                  </Button>
                </Link>
                <Link href="/registro/cliente">
                  <Button variant="gold" size="lg">
                    Quiero comprar arte peruano
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
