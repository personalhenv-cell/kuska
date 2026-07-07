'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Kusi } from '@/components/ui/Kusi'
import { TiltCard } from '@/components/ui/TiltCard'
import { cn } from '@/lib/utils'
import { FeatureDetailModal, type FeatureDetail } from './FeatureDetailModal'

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
  /** Si está presente, la card abre un modal con el detalle completo del módulo. */
  detail?: FeatureDetail
}

const FEATURE_DETAILS: Record<string, FeatureDetail> = {
  marketplace: {
    icon: '🛍️',
    title: 'Marketplace',
    tagline: 'Tu tienda propia, sin intermediarios que se queden con tu margen',
    description:
      'Cada artesano tiene su propia tienda dentro de Kuska: catálogo de productos, historia de su oficio y contacto directo por WhatsApp. El cliente compra piezas únicas sabiendo exactamente qué porcentaje del precio llega directo al artesano.',
    highlights: [
      'Tienda personalizada con catálogo exportable en PDF',
      'Checkout con seguimiento de pedido y estado de pago',
      'Contacto directo por WhatsApp en cada producto',
      'Reseñas con foto, verificadas solo de compradores reales',
    ],
    gateLabel: 'Artesanos y clientes',
    ctaLabel: 'Explorar el marketplace',
    ctaHref: '/marketplace',
    accent: 'red',
  },
  'cfo-bot': {
    icon: '🤖',
    title: 'CFO-Bot IA',
    tagline: 'Tu asesor financiero personal, disponible 24/7',
    description:
      'El CFO-Bot analiza en tiempo real las ventas, el stock y las visitas de tus productos para darte recomendaciones concretas — no genéricas. Chatea con él como con un asesor de confianza, en español y con datos reales de tu taller.',
    highlights: [
      'Alertas automáticas de stock bajo y productos sin ventas',
      'Recomendaciones basadas en tus datos reales, nunca inventadas',
      'Chat con streaming en tiempo real, disponible cuando lo necesites',
      'Exclusivo del plan Artesano Maestro',
    ],
    gateLabel: 'Plan Maestro',
    ctaLabel: 'Ver planes para artesanos',
    ctaHref: '/precios',
    accent: 'gold',
    poweredByAi: true,
  },
  emprendedor: {
    icon: '💡',
    title: 'Emprendedor IA',
    tagline: 'Tu plan de negocio, listo en minutos',
    description:
      'Cuéntale a Kuska IA tu idea de negocio — rubro, mercado, presupuesto — y recibe un plan de negocio completo y accionable, con análisis de mercado, propuesta de valor y proyecciones financieras. Descárgalo en PDF y preséntalo donde lo necesites.',
    highlights: [
      'Plan de negocio estructurado en segundos, no en semanas',
      'Análisis de mercado y propuesta de valor personalizados',
      'Descarga en PDF, listo para compartir con inversionistas',
      'Disponible para clientes marcados como emprendedores',
    ],
    gateLabel: 'Clientes Emprendedores',
    ctaLabel: 'Crear mi cuenta de cliente',
    ctaHref: '/registro/cliente',
    accent: 'teal',
    poweredByAi: true,
  },
  academia: {
    icon: '🎓',
    title: 'Academia Kuska',
    tagline: 'Aprende, certifícate y sigue creciendo en tu oficio',
    description:
      'Cursos en video pensados para artesanos: gestión de taller, fotografía de producto, precios y ventas digitales. Cada curso completado suma un certificado verificable con código QR, propio de cada artesano.',
    highlights: [
      'Cursos en video organizados por nivel y tema',
      'Certificado descargable con QR de verificación',
      'Contenido pensado para el contexto artesanal peruano',
      'Disponible para todos los artesanos registrados',
    ],
    gateLabel: 'Artesanos',
    ctaLabel: 'Unirme como artesano',
    ctaHref: '/registro/artesano',
    accent: 'gold',
  },
  ferias: {
    icon: '🖥️',
    title: 'Ferias Digitales',
    tagline: 'Exhibe tu taller en eventos virtuales temáticos',
    description:
      'Kuska organiza ferias digitales por temporada y técnica, donde los artesanos participantes ganan visibilidad destacada en la plataforma durante el evento. Postula, sé aprobado y aparece en el stand virtual del evento.',
    highlights: [
      'Calendario de ferias activas y próximas',
      'Postulación directa desde el panel del artesano',
      'Visibilidad destacada durante la feria en el marketplace',
      'Seguimiento del estado de tu participación',
    ],
    gateLabel: 'Artesanos',
    ctaLabel: 'Unirme como artesano',
    ctaHref: '/registro/artesano',
    accent: 'teal',
  },
  talleres: {
    icon: '🧵',
    title: 'Talleres',
    tagline: 'Enseña tu técnica o aprende una nueva, en vivo',
    description:
      'Artesanos maestros dictan talleres en vivo abiertos a clientes y otros artesanos: tejido, cerámica, retablos y más. Cada participante recibe recordatorio automático antes de la sesión para no perdérsela.',
    highlights: [
      'Talleres en vivo dictados por artesanos verificados',
      'Recordatorio automático por email y notificación push',
      'Cupos limitados con inscripción desde tu panel',
      'Material descargable de apoyo para cada sesión',
    ],
    gateLabel: 'Artesanos y clientes',
    ctaLabel: 'Crear mi cuenta',
    ctaHref: '/registro',
    accent: 'red',
  },
  capitalizacion: {
    icon: '💰',
    title: 'Hub Capitalización',
    tagline: 'Fondos y financiamiento real para tu proyecto',
    description:
      'Un solo lugar para descubrir y postular a fondos concursables y programas de financiamiento — desde entidades del Estado hasta alianzas privadas de Kuska. Postula desde la plataforma y sigue el estado de tu solicitud en tiempo real.',
    highlights: [
      'Fondos activos listados y actualizados constantemente',
      'Postulación y seguimiento de estado sin salir de Kuska',
      'Pensado tanto para artesanos como para emprendedores',
      'Alianzas reales en curso para ampliar el fondeo disponible',
    ],
    gateLabel: 'Artesanos y emprendedores',
    ctaLabel: 'Crear mi cuenta de cliente',
    ctaHref: '/registro/cliente',
    accent: 'gold',
  },
  raices: {
    icon: '📖',
    title: 'Módulo Raíces',
    tagline: 'Cuenta tu historia antes de que se pierda',
    description:
      'Un espacio para documentar el origen de cada oficio: historia familiar, audio narrado, genealogía y fotos del taller. Kuska preserva esta memoria y la muestra en el perfil público del artesano como parte real de cada pieza.',
    highlights: [
      'Editor de historia con audio narrado por el propio artesano',
      'Galería multimedia del taller y del proceso creativo',
      'Genealogía del oficio, de generación en generación',
      'Visible en el perfil público que ve cada comprador',
    ],
    gateLabel: 'Artesanos',
    ctaLabel: 'Unirme como artesano',
    ctaHref: '/registro/artesano',
    accent: 'red',
  },
  'red-cuentame': {
    icon: '🤝',
    title: 'Red Cuéntame',
    tagline: 'La comunidad donde artesanos y clientes se conectan',
    description:
      'Un feed social propio de Kuska: los artesanos comparten avances de taller y los clientes reaccionan, comentan y descubren nuevas historias. Todo dentro de la plataforma, sin depender de redes externas.',
    highlights: [
      'Publicaciones con fotos de avances y nuevas colecciones',
      'Reacciones y comentarios en tiempo real',
      'Filtros por tipo de autor para encontrar justo lo que buscas',
      'Conteo real de la comunidad activa cada mes',
    ],
    gateLabel: 'Artesanos y clientes',
    ctaLabel: 'Unirme a la comunidad',
    ctaHref: '/registro',
    accent: 'teal',
  },
  mapa: {
    icon: '🗺️',
    title: 'Mapa Artesanal',
    tagline: 'Descubre el talento peruano, región por región',
    description:
      'Un mapa interactivo con los artesanos verificados de Kuska ubicados en su comunidad real — desde Cusco hasta Ayacucho. Filtra por región y técnica para encontrar exactamente el oficio que buscas y conocer su historia.',
    highlights: [
      'Ubicación real de talleres y comunidades artesanas',
      'Filtro por región y técnica desde el marketplace',
      'Perfil del artesano a un clic desde cada punto del mapa',
      'Pensado para planear rutas de turismo vivencial',
    ],
    gateLabel: 'Clientes',
    ctaLabel: 'Explorar el mapa',
    ctaHref: '/marketplace',
    accent: 'red',
  },
  multilenguaje: {
    icon: '🌐',
    title: 'Multilenguaje',
    tagline: 'Kuska habla el idioma de todos sus artesanos',
    description:
      'Toda la plataforma está disponible en español, quechua e inglés, para que ningún artesano quede fuera por el idioma y ningún comprador internacional encuentre una barrera para conocer el arte peruano.',
    highlights: [
      'Cambio de idioma disponible en cualquier página',
      'Español, quechua e inglés, con más idiomas en camino',
      'Preferencia de idioma guardada en tu perfil',
      'Pensado para llegar tanto a Perú como al mundo',
    ],
    gateLabel: 'Toda la comunidad',
    ctaLabel: 'Crear mi cuenta',
    ctaHref: '/registro',
    accent: 'teal',
  },
  gamificacion: {
    icon: '🏆',
    title: 'Gamificación',
    tagline: 'Cada avance en Kuska suma y se nota',
    description:
      'Los artesanos suben de nivel a medida que venden, publican y completan cursos, desbloqueando insignias y misiones diarias. Es una forma real de reconocer el esfuerzo constante, no solo la venta puntual.',
    highlights: [
      '5 niveles de artesano según puntos acumulados',
      'Insignias por hitos reales: ventas, cursos, reseñas',
      'Misiones diarias que dan puntos extra',
      'Progreso visible en tu propio panel',
    ],
    gateLabel: 'Artesanos',
    ctaLabel: 'Unirme como artesano',
    ctaHref: '/registro/artesano',
    accent: 'gold',
  },
}

const FEATURES: Feature[] = [
  { icon: '🛍️', title: 'Marketplace', text: 'Vende tu arte al Perú y al mundo', role: 'Artesano', accent: 'red', subFeatures: ['Tienda personalizada', 'Pagos simulados'], big: true, detail: FEATURE_DETAILS.marketplace },
  { icon: '🤖', title: 'CFO-Bot IA', text: 'Tu asesor financiero personal con IA', role: 'Artesano', accent: 'gold', subFeatures: ['Chat financiero 24/7', 'Reportes automáticos'], big: true, detail: FEATURE_DETAILS['cfo-bot'] },
  { icon: '💡', title: 'Emprendedor IA', text: 'Planes de negocio generados por IA', role: 'Emprendedor', accent: 'teal', subFeatures: ['Plan de negocio en PDF', 'Proyecciones de venta'], detail: FEATURE_DETAILS.emprendedor },
  { icon: '🎓', title: 'Academia Kuska', text: 'Aprende y certifícate en tu oficio', role: 'Artesano', accent: 'gold', subFeatures: ['Cursos por video', 'Certificado con QR'], detail: FEATURE_DETAILS.academia },
  { icon: '🖥️', title: 'Ferias Digitales', text: 'Exhibe en eventos virtuales temáticos', role: 'Artesano', accent: 'teal', subFeatures: ['Stand virtual 3D', 'Calendario de eventos'], detail: FEATURE_DETAILS.ferias },
  { icon: '🧵', title: 'Talleres', text: 'Enseña y comparte tu técnica ancestral', role: 'Artesano', accent: 'red', subFeatures: ['Clases en vivo', 'Material descargable'], detail: FEATURE_DETAILS.talleres },
  { icon: '💰', title: 'Hub Capitalización', text: 'Accede a fondos y financiamiento', role: 'Emprendedor', accent: 'gold', subFeatures: ['Postulación a fondos', 'Seguimiento de estado'], detail: FEATURE_DETAILS.capitalizacion },
  { icon: '📖', title: 'Módulo Raíces', text: 'Cuenta tu historia, preserva tu cultura', role: 'Artesano', accent: 'red', subFeatures: ['Editor de historia', 'Galería multimedia'], detail: FEATURE_DETAILS.raices },
  { icon: '🤝', title: 'Red Cuéntame', text: 'Conecta con otros artesanos del Perú', role: 'Cliente', accent: 'teal', subFeatures: ['Feed social artesanal', 'Reacciones y comentarios'], detail: FEATURE_DETAILS['red-cuentame'] },
  { icon: '🗺️', title: 'Mapa Artesanal', text: 'Descubre artesanos por región', role: 'Cliente', accent: 'red', subFeatures: ['Filtro por región', 'Rutas artesanales'], detail: FEATURE_DETAILS.mapa },
  { icon: '🌐', title: 'Multilenguaje', text: 'Español, Quechua e Inglés', role: 'Cliente', accent: 'teal', subFeatures: ['ES · QU · EN', 'Traducción automática'], detail: FEATURE_DETAILS.multilenguaje },
  { icon: '🏆', title: 'Gamificación', text: 'Niveles, misiones e insignias', role: 'Cliente', accent: 'gold', subFeatures: ['5 niveles de artesano', 'Misiones diarias'], detail: FEATURE_DETAILS.gamificacion },
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
  const [activeFeature, setActiveFeature] = useState<FeatureDetail | null>(null)

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
              <div
                className={cn(
                  'flex h-full min-h-[280px] flex-col rounded-card border border-kuska-border bg-white p-6 transition-shadow duration-300 group-hover:shadow-[0_18px_40px_rgba(61,28,2,0.12),0_0_24px_rgba(212,146,10,0.15)]',
                  f.detail && 'cursor-pointer',
                )}
                role={f.detail ? 'button' : undefined}
                tabIndex={f.detail ? 0 : undefined}
                onClick={f.detail ? () => setActiveFeature(f.detail!) : undefined}
                onKeyDown={
                  f.detail
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setActiveFeature(f.detail!)
                        }
                      }
                    : undefined
                }
              >
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
                {f.detail && (
                  <span className="mt-3 inline-flex items-center gap-1 font-nunito text-xs font-bold text-kuska-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Ver detalle →
                  </span>
                )}
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

      <FeatureDetailModal feature={activeFeature} onClose={() => setActiveFeature(null)} />
    </section>
  )
}
