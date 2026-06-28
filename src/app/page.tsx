'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// ── LOADING SCREEN ────────────────────────────────────────────────────────────

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const steps = [15, 35, 55, 72, 88, 96, 100]
    let i = 0
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i++])
        setTimeout(tick, 180 + Math.random() * 120)
      } else {
        setTimeout(() => {
          sessionStorage.setItem('kuska_loaded', '1')
          onDone()
        }, 400)
      }
    }
    setTimeout(tick, 200)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#060402' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center gap-8"
      >
        <Image src="/logo.png" alt="Kuska" width={72} height={72} className="rounded-2xl shadow-2xl" priority />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Kuska</h1>
          <p className="text-[#F0EAE0]/40 text-sm mt-1 tracking-widest uppercase">Plataforma Artesanal</p>
        </div>
        <div className="w-48">
          <div className="h-px bg-[#F0EAE0]/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C84B2F] to-[#D4920A]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
          <p className="text-center text-[#F0EAE0]/25 text-xs mt-3">{progress}%</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── NAVBAR ─────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-cream py-3' : 'py-5'}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="Kuska" width={36} height={36} className="rounded-xl" />
          <span className="text-[#F0EAE0] font-bold text-lg tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Kuska</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[['Marketplace', '/marketplace'], ['Artesanos', '/artesanos'], ['Raíces', '/raices'], ['Academia', '/academia']].map(([label, href]) => (
            <Link key={href} href={href} className="text-[#F0EAE0]/60 hover:text-[#F0EAE0] text-sm transition-colors duration-150">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login"
            className="hidden md:block text-sm text-[#F0EAE0]/60 hover:text-[#F0EAE0] transition-colors duration-150 px-4 py-2">
            Ingresar
          </Link>
          <Link href="/registro"
            className="btn-press text-sm bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150">
            Registrarse
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden btn-press p-2 text-[#F0EAE0]/60 hover:text-[#F0EAE0] transition-colors"
            aria-label="Menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: 'top' }}
            className="md:hidden glass-cream mt-2 mx-4 rounded-2xl p-4 flex flex-col gap-2"
          >
            {[['Marketplace', '/marketplace'], ['Artesanos', '/artesanos'], ['Raíces', '/raices'], ['Academia', '/academia'], ['Ingresar', '/login']].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="text-[#F0EAE0]/70 hover:text-[#F0EAE0] py-2 px-3 rounded-xl hover:bg-white/5 transition-colors text-sm">
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ── HERO ───────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      setMouseX((e.clientX - rect.left - rect.width / 2) / rect.width)
      setMouseY((e.clientY - rect.top - rect.height / 2) / rect.height)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#070503' }}>
      {/* Ambient blobs */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #C84B2F, transparent)', filter: 'blur(80px)',
            transform: `translate(${mouseX * 20}px, ${mouseY * 20}px)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #2E7A6E, transparent)', filter: 'blur(80px)',
            transform: `translate(${-mouseX * 15}px, ${-mouseY * 15}px)` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #D4920A, transparent)', filter: 'blur(60px)' }} />
      </motion.div>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(240,234,224,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(240,234,224,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <motion.div style={{ y: y2, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7A6E]" />
          <span className="text-[#F0EAE0]/60 text-xs tracking-widest uppercase">Primera plataforma artesanal del Perú</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          <span className="text-[#F0EAE0]">Arte que</span>
          <br />
          <span className="gradient-text">cuenta historias</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.35 }}
          className="text-[#F0EAE0]/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Kuska conecta artesanos peruanos con el mundo, preservando la herencia cultural
          a través de tecnología, IA y comunidad.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.48 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/marketplace"
            className="btn-press inline-flex items-center gap-2 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold px-8 py-4 rounded-2xl text-base transition-colors duration-150 shadow-lg">
            Explorar Marketplace
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link href="/registro"
            className="btn-press inline-flex items-center gap-2 glass text-[#F0EAE0] hover:bg-white/10 font-medium px-8 py-4 rounded-2xl text-base transition-colors duration-150">
            Soy Artesano
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.62 }}
          className="flex items-center justify-center gap-12 mt-16 pt-12 border-t border-[#F0EAE0]/[0.06]"
        >
          {[['1,200+', 'Artesanos'], ['8,400+', 'Productos'], ['24', 'Regiones']].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>{value}</div>
              <div className="text-[#F0EAE0]/40 text-xs mt-1 tracking-wider uppercase">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#F0EAE0]/30 text-xs tracking-widest uppercase">Explorar</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <svg className="w-4 h-4 text-[#F0EAE0]/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── MODULES SECTION ────────────────────────────────────────────────────────────

const MODULES = [
  { icon: '🏪', title: 'Marketplace', desc: 'Vende directamente con historia cultural detrás de cada pieza.', color: '#C84B2F', href: '/marketplace' },
  { icon: '📖', title: 'Raíces', desc: 'Documenta tu linaje artesanal en audio, video y texto multilingüe.', color: '#D4920A', href: '/artesano/raices' },
  { icon: '🤖', title: 'CFO-Bot IA', desc: 'Tu contador personal con inteligencia artificial, 24/7.', color: '#2E7A6E', href: '/artesano/cfo' },
  { icon: '🎪', title: 'Ferias', desc: 'Ferias físicas y digitales. Conecta con compradores del mundo.', color: '#C84B2F', href: '/artesano/ferias' },
  { icon: '🎓', title: 'Academia', desc: 'Cursos de negocio, marketing digital y gestión financiera.', color: '#D4920A', href: '/artesano/academia' },
  { icon: '💰', title: 'Capitalización', desc: 'Score crediticio basado en reputación. Accede a financiamiento.', color: '#2E7A6E', href: '/artesano/scoring' },
]

function ModulesSection() {
  return (
    <section className="py-28 px-6" style={{ background: '#0B0804' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <p className="text-[#D4920A] text-sm tracking-widest uppercase mb-4">Plataforma completa</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Todo lo que necesitas
          </h2>
          <p className="text-[#F0EAE0]/40 mt-4 max-w-xl mx-auto">
            Kuska no es solo un marketplace — es el ecosistema completo para el artesano peruano del siglo XXI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.06 }}
            >
              <Link href={m.href} className="block h-full">
                <div className="glass card-hover h-full p-6 rounded-2xl group">
                  <div className="text-3xl mb-4">{m.icon}</div>
                  <h3 className="text-[#F0EAE0] font-semibold text-lg mb-2 group-hover:text-white transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>{m.title}</h3>
                  <p className="text-[#F0EAE0]/45 text-sm leading-relaxed">{m.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium transition-all duration-150"
                    style={{ color: m.color }}>
                    Explorar
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

// ── DOS MUNDOS ─────────────────────────────────────────────────────────────────

function DosMundos() {
  return (
    <section className="py-28 px-6" style={{ background: '#070503' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Un mundo, dos caminos
          </h2>
          <p className="text-[#F0EAE0]/40 mt-4 max-w-xl mx-auto">
            Ya seas artesano o emprendedor, Kuska tiene el ecosistema perfecto para ti.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              tag: 'Para Artesanos',
              title: 'Tu taller conectado al mundo',
              desc: 'Crea tu perfil, sube tus productos con historia, gestiona tus ventas con IA y accede a crédito basado en tu reputación Kuska.',
              color: '#C84B2F',
              bg: 'rgba(200,75,47,0.06)',
              border: 'rgba(200,75,47,0.15)',
              cta: 'Registrarme como artesano',
              href: '/registro?rol=artesano',
              features: ['Dashboard completo', 'CFO-Bot IA 24/7', 'Score crediticio', 'Ferias y talleres'],
            },
            {
              tag: 'Para Emprendedores',
              title: 'Construye tu negocio con IA',
              desc: 'Explora el marketplace, conecta con artesanos, y recibe un plan de negocio personalizado con nuestra IA Emprendedor.',
              color: '#2E7A6E',
              bg: 'rgba(46,122,110,0.06)',
              border: 'rgba(46,122,110,0.15)',
              cta: 'Explorar como cliente',
              href: '/registro?rol=cliente',
              features: ['Marketplace curado', 'IA Emprendedor', 'Planes de negocio', 'Talleres artesanales'],
            },
          ].map((card, i) => (
            <motion.div
              key={card.tag}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 }}
              className="rounded-3xl p-8 border"
              style={{ background: card.bg, borderColor: card.border }}
            >
              <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ color: card.color, background: `${card.color}18` }}>
                {card.tag}
              </span>
              <h3 className="text-2xl font-bold text-[#F0EAE0] mt-4 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{card.title}</h3>
              <p className="text-[#F0EAE0]/45 text-sm leading-relaxed mb-6">{card.desc}</p>
              <ul className="space-y-2 mb-8">
                {card.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#F0EAE0]/60">
                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: card.color }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={card.href}
                className="btn-press inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-150 text-white"
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

// ── CTA ────────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="py-28 px-6" style={{ background: '#060402' }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-[#F0EAE0] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            El Perú artesanal<br />
            <span className="gradient-text">empieza aquí</span>
          </h2>
          <p className="text-[#F0EAE0]/40 text-lg mb-10">
            Únete a la comunidad que está transformando la artesanía peruana.
          </p>
          <Link href="/registro"
            className="btn-press inline-flex items-center gap-3 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-bold px-10 py-5 rounded-2xl text-lg transition-colors duration-150 shadow-2xl">
            Comenzar gratis
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-[#F0EAE0]/25 text-sm mt-4">Sin tarjeta de crédito · Plan básico siempre gratis</p>
        </motion.div>
      </div>
    </section>
  )
}

// ── FOOTER ─────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[#F0EAE0]/[0.06] py-12 px-6" style={{ background: '#060402' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Kuska" width={32} height={32} className="rounded-xl" />
            <span className="text-[#F0EAE0]/60 text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>Kuska © 2026</span>
          </div>
          <div className="flex items-center gap-6">
            {[['Términos', '/terminos'], ['Privacidad', '/privacidad'], ['Contacto', '/contacto']].map(([label, href]) => (
              <Link key={href} href={href} className="text-[#F0EAE0]/30 hover:text-[#F0EAE0]/60 text-xs transition-colors duration-150">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-[#F0EAE0]/20 text-xs">Hecho con ❤️ en Perú 🇵🇪</p>
        </div>
      </div>
    </footer>
  )
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [phase, setPhase] = useState<'init' | 'loading' | 'ready'>('init')

  useEffect(() => {
    requestAnimationFrame(() => {
      const loaded = sessionStorage.getItem('kuska_loaded')
      setPhase(loaded ? 'ready' : 'loading')
    })
  }, [])

  if (phase === 'init') return null

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <LoadingScreen key="loading" onDone={() => setPhase('ready')} />
        )}
      </AnimatePresence>

      {phase === 'ready' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Navbar />
          <Hero />
          <ModulesSection />
          <DosMundos />
          <CTA />
          <Footer />
        </motion.div>
      )}
    </>
  )
}
