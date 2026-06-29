'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Kusi from '@/components/ui/Kusi'
import AllyLogo from '@/components/ui/AllyLogo'
import { ALLIES_STRIP } from '@/lib/data/allies'
import { useLanguage } from '@/contexts/LanguageContext'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

// Palabras quechua flotantes en el hero
const QUECHUA_WORDS = [
  { w: 'Away',   m: 'tejer',    top: '18%', left: '8%',  delay: 0 },
  { w: 'Maki',   m: 'mano',     top: '28%', left: '82%', delay: 0.6 },
  { w: 'Sumaq',  m: 'hermoso',  top: '62%', left: '12%', delay: 1.1 },
  { w: 'Ruway',  m: 'crear',    top: '70%', left: '78%', delay: 0.3 },
  { w: 'Llaqta', m: 'pueblo',   top: '44%', left: '90%', delay: 0.9 },
  { w: 'Kuska',  m: 'juntos',   top: '52%', left: '4%',  delay: 1.4 },
]

function FloatingWords() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden>
      {QUECHUA_WORDS.map(q => (
        <motion.div
          key={q.w}
          className="absolute text-center"
          style={{ top: q.top, left: q.left }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0.5, 0.5, 0], y: [10, -10, -14, -24] }}
          transition={{ duration: 9, delay: q.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-display italic text-2xl text-k-brown/40">{q.w}</span>
          <span className="block text-[10px] uppercase tracking-widest text-k-ink/30">{q.m}</span>
        </motion.div>
      ))}
    </div>
  )
}

function AndeanMountains({ y }: { y: MotionValue<number> }) {
  return (
    <motion.div style={{ y }} className="absolute bottom-0 inset-x-0 pointer-events-none" aria-hidden>
      <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
        {/* cordillera lejana (teal) */}
        <path fill="#2E7A6E" fillOpacity="0.18"
          d="M0,224 L160,160 L320,208 L480,128 L640,192 L800,112 L960,176 L1120,128 L1280,192 L1440,144 L1440,320 L0,320 Z" />
        {/* media (gold) */}
        <path fill="#D4920A" fillOpacity="0.22"
          d="M0,272 L180,208 L360,256 L540,192 L720,248 L900,184 L1080,240 L1260,200 L1440,256 L1440,320 L0,320 Z" />
        {/* cercana (brown) */}
        <path fill="#3D1C02" fillOpacity="0.92"
          d="M0,288 L240,240 L480,288 L720,232 L960,288 L1200,248 L1440,296 L1440,320 L0,320 Z" />
      </svg>
    </motion.div>
  )
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yContent  = useTransform(scrollYProgress, [0, 1], [0, -60])
  const yMountain = useTransform(scrollYProgress, [0, 1], [0, 50])
  const opacity   = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#F7F2EA 0%,#F2E9DA 55%,#EADBC4 100%)' }}
    >
      {/* glows cálidos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-[460px] h-[460px] rounded-full opacity-[0.18]"
          style={{ background: 'radial-gradient(circle,#D4920A,transparent 70%)', filter: 'blur(70px)' }} />
        <div className="absolute bottom-1/3 right-1/5 w-[380px] h-[380px] rounded-full opacity-[0.14]"
          style={{ background: 'radial-gradient(circle,#C84B2F,transparent 70%)', filter: 'blur(70px)' }} />
      </div>

      <FloatingWords />
      <AndeanMountains y={yMountain} />

      <motion.div style={{ y: yContent, opacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-2 mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-k-teal animate-pulse" />
          <span className="text-k-ink/70 text-xs tracking-widest uppercase font-semibold">Primera plataforma artesanal del Perú</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="font-display font-extrabold leading-[0.95] tracking-tight text-k-ink text-5xl md:text-7xl lg:text-8xl mb-6"
        >
          Arte que
          <br />
          <span className="gradient-text">cuenta historias</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
          className="text-k-ink/65 text-lg md:text-xl max-w-2xl mx-auto mb-9 leading-relaxed"
        >
          Kuska conecta a los artesanos peruanos con el mundo, preservando la herencia
          cultural a través de tecnología, inteligencia artificial y comunidad.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.48 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/marketplace"
            className="btn-press inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl text-base shadow-lg"
            style={{ background: '#C84B2F' }}>
            Explorar Marketplace
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link href="/registro"
            className="btn-press inline-flex items-center gap-2 liquid-glass text-k-ink font-semibold px-8 py-4 rounded-2xl text-base hover:bg-white/40 transition-colors">
            Soy artesano
          </Link>
        </motion.div>
      </motion.div>

      {/* Kusi saludando, esquina */}
      <div className="absolute bottom-10 right-6 md:right-12 z-20 hidden sm:block">
        <Kusi size="md" animation="wave" priority />
      </div>
    </section>
  )
}

const STATS: [string, string][] = [['1,200+', 'Artesanos'], ['8,400+', 'Productos'], ['24', 'Regiones'], ['100%', 'Hecho en Perú']]

function Stats() {
  return (
    <section className="py-16 px-6" style={{ background: '#EADBC4' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(([value, label], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
            className="text-center"
          >
            <div className="font-display font-extrabold text-3xl md:text-4xl text-k-red">{value}</div>
            <div className="text-k-ink/55 text-xs mt-1 tracking-wider uppercase font-semibold">{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function ConfianEnKuska() {
  const { t } = useLanguage()
  return (
    <section className="py-16 px-6" style={{ background: '#F5F0E8' }}>
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}
          className="text-center text-k-ink/55 text-sm font-semibold tracking-widest uppercase mb-8"
        >
          {t('allies.title')}
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          {ALLIES_STRIP.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
            >
              <Link href="/alianzas" aria-label={a.name}><AllyLogo ally={a} mode="strip" /></Link>
            </motion.div>
          ))}
          <Kusi size="xs" animation="idle" message="¡Todos juntos! 🦙" bubbleSide="left" />
        </div>
      </div>
    </section>
  )
}

const MODULES = [
  { icon: '🏺', title: 'Marketplace', desc: 'Vende directamente con la historia cultural detrás de cada pieza.', color: '#C84B2F', href: '/marketplace' },
  { icon: '📖', title: 'Raíces', desc: 'Documenta tu linaje artesanal en audio, video y texto multilingüe.', color: '#D4920A', href: '/registro' },
  { icon: '🤖', title: 'CFO-Bot IA', desc: 'Tu contador personal con inteligencia artificial, disponible 24/7.', color: '#2E7A6E', href: '/registro' },
  { icon: '🎪', title: 'Ferias', desc: 'Ferias físicas y digitales. Conecta con compradores de todo el mundo.', color: '#C84B2F', href: '/registro' },
  { icon: '🎓', title: 'Academia', desc: 'Cursos de negocio, marketing digital y gestión financiera.', color: '#D4920A', href: '/registro' },
  { icon: '💰', title: 'Capitalización', desc: 'Score crediticio basado en tu reputación. Accede a financiamiento.', color: '#2E7A6E', href: '/registro' },
]

function Modules() {
  return (
    <section className="py-24 px-6" style={{ background: '#EFE7DA' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-14"
        >
          <p className="text-k-gold text-sm tracking-widest uppercase mb-3 font-bold">Plataforma completa</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-k-ink">Todo lo que necesitas</h2>
          <p className="text-k-ink/55 mt-4 max-w-xl mx-auto">
            Kuska no es solo un marketplace — es el ecosistema completo para el artesano peruano del siglo XXI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
            >
              <Link href={m.href} className="block h-full">
                <div className="liquid-glass card-hover h-full p-6 rounded-2xl group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: `${m.color}1a` }}>{m.icon}</div>
                  <h3 className="font-display text-k-ink font-bold text-lg mb-2">{m.title}</h3>
                  <p className="text-k-ink/60 text-sm leading-relaxed">{m.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold" style={{ color: m.color }}>
                    Explorar
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DosMundos() {
  const cards = [
    { tag: 'Para Artesanos', title: 'Tu taller conectado al mundo',
      desc: 'Crea tu perfil, sube tus productos con historia, gestiona tus ventas con IA y accede a crédito basado en tu reputación Kuska.',
      color: '#C84B2F', href: '/registro?rol=artesano', cta: 'Registrarme como artesano',
      features: ['Dashboard completo', 'CFO-Bot IA 24/7', 'Score crediticio', 'Ferias y talleres'] },
    { tag: 'Para Emprendedores', title: 'Construye tu negocio con IA',
      desc: 'Explora el marketplace, conecta con artesanos y recibe un plan de negocio personalizado con nuestra IA Emprendedor.',
      color: '#2E7A6E', href: '/registro?rol=cliente', cta: 'Explorar como cliente',
      features: ['Marketplace curado', 'IA Emprendedor', 'Planes de negocio', 'Talleres artesanales'] },
  ]
  return (
    <section className="py-24 px-6" style={{ background: '#F5F0E8' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-14"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-k-ink">Un mundo, dos caminos</h2>
          <p className="text-k-ink/55 mt-4 max-w-xl mx-auto">
            Ya seas artesano o emprendedor, Kuska tiene el ecosistema perfecto para ti.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.tag}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
              className="rounded-3xl p-8 border bg-white/50"
              style={{ borderColor: `${card.color}33` }}
            >
              <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ color: card.color, background: `${card.color}1a` }}>{card.tag}</span>
              <h3 className="font-display text-2xl font-bold text-k-ink mt-4 mb-3">{card.title}</h3>
              <p className="text-k-ink/60 text-sm leading-relaxed mb-6">{card.desc}</p>
              <ul className="space-y-2 mb-8">
                {card.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-k-ink/70">
                    <svg className="w-4 h-4 shrink-0" style={{ color: card.color }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={card.href}
                className="btn-press inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl text-white"
                style={{ background: card.color }}>
                {card.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: '#3D1C02' }}>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle,#D4920A,transparent 70%)' }} />
      <div className="max-w-3xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="flex justify-center mb-6"><Kusi size="lg" animation="celebrate" /></div>
          <h2 className="font-display font-extrabold text-4xl md:text-6xl text-[#F5F0E8] mb-6 leading-tight">
            El Perú artesanal<br /><span className="gradient-text">empieza aquí</span>
          </h2>
          <p className="text-[#F5F0E8]/65 text-lg mb-10">
            Únete a la comunidad que está transformando la artesanía peruana.
          </p>
          <Link href="/registro"
            className="btn-press inline-flex items-center gap-3 text-white font-bold px-10 py-5 rounded-2xl text-lg shadow-2xl"
            style={{ background: '#C84B2F' }}>
            Comenzar gratis
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-[#F5F0E8]/40 text-sm mt-4">Sin tarjeta de crédito · Plan básico siempre gratis</p>
        </motion.div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <ConfianEnKuska />
      <Modules />
      <DosMundos />
      <CTA />
      <Footer />
    </>
  )
}
