'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Kusi } from '@/components/ui/Kusi'
import { TiltCard } from '@/components/ui/TiltCard'

type Role = 'Artesano' | 'Cliente' | 'Emprendedor'
type Accent = 'red' | 'gold' | 'teal'

interface Feature {
  icon: string
  title: string
  text: string
  role: Role
  accent: Accent
  subFeatures: [string, string]
  big?: boolean
}

const FEATURES: Feature[] = [
  { icon: '🛍️', title: 'Marketplace', text: 'Vende tu arte al Perú y al mundo', role: 'Artesano', accent: 'red', subFeatures: ['Tienda personalizada', 'Pagos simulados'], big: true },
  { icon: '🤖', title: 'CFO-Bot IA', text: 'Tu asesor financiero personal con IA', role: 'Artesano', accent: 'gold', subFeatures: ['Chat financiero 24/7', 'Reportes automáticos'], big: true },
  { icon: '💡', title: 'Emprendedor IA', text: 'Planes de negocio generados por IA', role: 'Emprendedor', accent: 'teal', subFeatures: ['Plan de negocio en PDF', 'Proyecciones de venta'] },
  { icon: '🎓', title: 'Academia Kuska', text: 'Aprende y certifícate en tu oficio', role: 'Artesano', accent: 'gold', subFeatures: ['Cursos por video', 'Certificado con QR'] },
  { icon: '🖥️', title: 'Ferias Digitales', text: 'Exhibe en eventos virtuales temáticos', role: 'Artesano', accent: 'teal', subFeatures: ['Stand virtual 3D', 'Calendario de eventos'] },
  { icon: '🧵', title: 'Talleres', text: 'Enseña y comparte tu técnica ancestral', role: 'Artesano', accent: 'red', subFeatures: ['Clases en vivo', 'Material descargable'] },
  { icon: '💰', title: 'Hub Capitalización', text: 'Accede a fondos y financiamiento', role: 'Emprendedor', accent: 'gold', subFeatures: ['Postulación a fondos', 'Seguimiento de estado'] },
  { icon: '📖', title: 'Módulo Raíces', text: 'Cuenta tu historia, preserva tu cultura', role: 'Artesano', accent: 'red', subFeatures: ['Editor de historia', 'Galería multimedia'] },
  { icon: '🤝', title: 'Red Cuéntame', text: 'Conecta con otros artesanos del Perú', role: 'Cliente', accent: 'teal', subFeatures: ['Feed social artesanal', 'Reacciones y comentarios'] },
  { icon: '🗺️', title: 'Mapa Artesanal', text: 'Descubre artesanos por región', role: 'Cliente', accent: 'red', subFeatures: ['Filtro por región', 'Rutas artesanales'] },
  { icon: '🌐', title: 'Multilenguaje', text: 'Español, Quechua e Inglés', role: 'Cliente', accent: 'teal', subFeatures: ['ES · QU · EN', 'Traducción automática'] },
  { icon: '🏆', title: 'Gamificación', text: 'Niveles, misiones e insignias', role: 'Cliente', accent: 'gold', subFeatures: ['5 niveles de artesano', 'Misiones diarias'] },
]

const ACCENT_GRADIENT: Record<Accent, string> = {
  red: 'linear-gradient(135deg, #3D1C02 0%, #C84B2F 100%)',
  gold: 'linear-gradient(135deg, #3D1C02 0%, #D4920A 100%)',
  teal: 'linear-gradient(135deg, #3D1C02 0%, #2E7A6E 100%)',
}

const ROLE_BADGE: Record<Role, string> = {
  Artesano: 'bg-kuska-red/12 border-kuska-red/25 text-kuska-red',
  Cliente: 'bg-kuska-teal/12 border-kuska-teal/25 text-kuska-teal',
  Emprendedor: 'bg-kuska-gold/15 border-kuska-gold/30 text-[#9a6a07]',
}

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="new" className="mb-4">
          Explora los módulos
        </Badge>
        <h2 className="font-display text-h3 text-kuska-text sm:text-h2">
          Todo lo que necesitas para crecer, en un solo lugar
        </h2>
        <p className="mt-4 font-body text-kuska-text-mid">
          Kuska, creada por Agencia CEIPE, es la innovación que valora y
          empodera a los artesanos de todo el Perú.
        </p>
      </div>

      <motion.div
        className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
            }}
            className={f.big ? 'col-span-2' : ''}
          >
            <TiltCard className="group h-full min-h-[280px] rounded-card">
              <div className="flex h-full min-h-[280px] flex-col rounded-card border border-kuska-border bg-white p-6 transition-shadow duration-300 group-hover:shadow-[0_18px_40px_rgba(61,28,2,0.12),0_0_24px_rgba(212,146,10,0.15)]">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-sm"
                    style={{ background: ACCENT_GRADIENT[f.accent] }}
                  >
                    <span className={f.big ? 'text-3xl' : 'text-2xl'}>{f.icon}</span>
                  </div>
                  <span
                    className={`whitespace-nowrap rounded-full border px-2.5 py-1 font-nunito text-[10px] font-bold uppercase tracking-wide ${ROLE_BADGE[f.role]}`}
                  >
                    {f.role}
                  </span>
                </div>
                <h3 className={`mt-4 font-display font-bold text-kuska-text ${f.big ? 'text-2xl' : 'text-lg'}`}>
                  {f.title}
                </h3>
                <p className="mt-1.5 font-body text-sm leading-relaxed text-kuska-text-mid">
                  {f.text}
                </p>
                <ul className="mt-auto space-y-1 pt-4">
                  {f.subFeatures.map((s) => (
                    <li key={s} className="flex items-center gap-2 font-nunito text-xs text-kuska-text-mid">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rotate-45 bg-kuska-gold" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </motion.div>
        ))}

        {/* Card final — Sigue explorando */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 24 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
          }}
          className="col-span-2"
        >
          <TiltCard className="group h-full min-h-[280px] rounded-card">
            <Link
              href="/marketplace"
              className="relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-card p-6 transition-shadow duration-300 group-hover:shadow-[0_18px_40px_rgba(61,28,2,0.3),0_0_32px_rgba(212,146,10,0.25)]"
              style={{ background: 'linear-gradient(140deg, #3D1C02 0%, #6B3A10 55%, #2E7A6E 130%)' }}
            >
              <div className="andean-texture pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
              <div className="relative">
                <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold">
                  Y esto es solo el comienzo
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-kuska-cream sm:text-3xl">
                  Sigue explorando Kuska
                </h3>
                <p className="mt-2 max-w-sm font-body text-sm text-kuska-cream/75">
                  Descubre piezas únicas con historia y conoce a las manos que las crean.
                </p>
              </div>
              <div className="relative flex items-end justify-between">
                <span className="inline-flex items-center gap-2 rounded-btn bg-kuska-gold px-5 py-3 font-body text-sm font-bold text-kuska-brown transition-transform duration-300 group-hover:translate-x-1">
                  Ir al marketplace →
                </span>
                <Kusi size="md" animation="float" />
              </div>
            </Link>
          </TiltCard>
        </motion.div>
      </motion.div>
    </section>
  )
}
