'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
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

const CROSSHATCH = {
  backgroundImage:
    'repeating-linear-gradient(45deg, rgba(46,122,110,0.12) 0, rgba(46,122,110,0.12) 1px, transparent 1px, transparent 20px)',
}

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
          El ecosistema Kuska
        </Badge>
        <h2 className="font-display text-h3 text-kuska-text sm:text-h2">
          Todo lo que el artesano peruano necesita, en un solo lugar
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
            <TiltCard className="group relative h-full min-h-[280px] rounded-card">
              <div
                className="pointer-events-none absolute -inset-1 rounded-card opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
                style={{ background: 'linear-gradient(135deg, #C84B2F, #D4920A, #2E7A6E)' }}
                aria-hidden
              />
              <div className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-card border border-kuska-border bg-white p-6">
                <div className="pointer-events-none absolute inset-0 opacity-60" style={CROSSHATCH} aria-hidden />

                <div className="relative flex-1">
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
                </div>

                {/* Sub-funcionalidades — reveal deslizando desde abajo en hover */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full rounded-b-card bg-kuska-brown px-6 py-4 text-kuska-cream transition-transform duration-300 ease-out group-hover:translate-y-0">
                  <ul className="space-y-1">
                    {f.subFeatures.map((s) => (
                      <li key={s} className="flex items-center gap-2 font-nunito text-xs">
                        <span className="h-1.5 w-1.5 flex-shrink-0 rotate-45 bg-kuska-gold" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
