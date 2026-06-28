'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useMotionValue,
  useAnimation,
} from 'framer-motion'

// ── PALETA ────────────────────────────────────────────────────────────────────
// Brown #3D1C02 · Red #C84B2F · Teal #2E7A6E · Gold #D4920A · Cream #F5F0E8

const FRASES_LOADING = [
  '"Kuska" — Juntos en quechua',
  'Preservando el arte ancestral del Perú',
  'Conectando artesanos con el mundo',
  'Historias tejidas en cada pieza',
  'Cultura viva en tus manos',
  '100,000 artesanos, una sola plataforma',
  'Apoya · Conoce · Transforma',
]

const REGIONES = [
  'Todas las regiones','Amazonas','Áncash','Apurímac','Arequipa',
  'Ayacucho','Cajamarca','Callao','Cusco','Huancavelica','Huánuco',
  'Ica','Junín','La Libertad','Lambayeque','Lima','Loreto',
  'Madre de Dios','Moquegua','Pasco','Piura','Puno','San Martín',
  'Tacna','Tumbes','Ucayali',
]

const RUBROS = [
  'Todos los rubros','Textilería','Cerámica','Joyería y orfebrería',
  'Madera tallada','Cestería','Pintura y arte','Cuero y pieles',
  'Piedra y metal','Instrumentos musicales','Bordados','Retablos',
]

const CATEGORIAS = [
  { icon:'🧶', nombre:'Textilería',     desc:'Tejidos, mantas, chullos',     color:'from-amber-50 to-orange-50',   border:'border-amber-200',   badge:'bg-amber-100 text-amber-700' },
  { icon:'🏺', nombre:'Cerámica',       desc:'Vasijas, figuras, chulucanas', color:'from-red-50 to-rose-50',       border:'border-red-200',     badge:'bg-red-100 text-red-700' },
  { icon:'💍', nombre:'Joyería',        desc:'Plata, oro, filigrana',        color:'from-yellow-50 to-amber-50',   border:'border-yellow-200',  badge:'bg-yellow-100 text-yellow-700' },
  { icon:'🪵', nombre:'Madera',         desc:'Tallado, retablos, máscaras',  color:'from-stone-50 to-amber-50',    border:'border-stone-200',   badge:'bg-stone-100 text-stone-700' },
  { icon:'🧺', nombre:'Cestería',       desc:'Canastas, sombreros, esteras', color:'from-lime-50 to-green-50',     border:'border-lime-200',    badge:'bg-lime-100 text-lime-700' },
  { icon:'🎨', nombre:'Arte & Pintura', desc:'Retablos ayacuchanos',         color:'from-violet-50 to-purple-50',  border:'border-violet-200',  badge:'bg-violet-100 text-violet-700' },
  { icon:'🪡', nombre:'Bordados',       desc:'Huancayo, Ayacucho, Cusco',    color:'from-pink-50 to-rose-50',      border:'border-pink-200',    badge:'bg-pink-100 text-pink-700' },
  { icon:'🥁', nombre:'Instrumentos',   desc:'Quenas, charangos, zampoñas',  color:'from-teal-50 to-cyan-50',      border:'border-teal-200',    badge:'bg-teal-100 text-teal-700' },
]

const MODULOS = [
  { n:'01', icon:'🪪', titulo:'Identidad Digital',    desc:'Validación con RENIEC en tiempo real.',           color:'bg-red-500' },
  { n:'02', icon:'🛒', titulo:'Marketplace Herencia', desc:'Filtros por región, distrito y linaje cultural.', color:'bg-teal-600' },
  { n:'03', icon:'🌿', titulo:'Módulo Raíces',        desc:'Historia de cada pieza en 4 idiomas.',            color:'bg-amber-600' },
  { n:'04', icon:'🎪', titulo:'Ferias Digitales',     desc:'Eventos virtuales con streaming en vivo.',        color:'bg-purple-600' },
  { n:'05', icon:'🤖', titulo:'IA Coordinador',       desc:'Organización inteligente de ferias físicas.',     color:'bg-blue-600' },
  { n:'06', icon:'💬', titulo:'Red Cuéntame',         desc:'Comunidad interna de artesanos.',                 color:'bg-pink-600' },
  { n:'07', icon:'🎓', titulo:'Gestor Talleres',      desc:'Clases vivenciales con reservas integradas.',     color:'bg-orange-600' },
  { n:'08', icon:'🗣️', titulo:'Puente Lingüístico',  desc:'Quechua, Aymara y Awajún sin barreras.',          color:'bg-emerald-600' },
  { n:'09', icon:'🏆', titulo:'Hub Capitalización',  desc:'Scoring social para atraer inversiones.',         color:'bg-yellow-600' },
  { n:'10', icon:'📚', titulo:'Academia Kuska',       desc:'Formación con BCP, Intercorp y Romero.',          color:'bg-indigo-600' },
  { n:'11', icon:'📊', titulo:'CFO-bot IA',           desc:'Contabilidad automatizada con inteligencia.',     color:'bg-rose-600' },
  { n:'12', icon:'🚚', titulo:'Logística Rural',      desc:'Puntos comunitarios y trazabilidad GPS.',         color:'bg-slate-600' },
]

const STATS = [
  { num:'100K+', label:'Artesanos a conectar', color:'text-[#C84B2F]' },
  { num:'25',    label:'Regiones del Perú',    color:'text-[#2E7A6E]' },
  { num:'12',    label:'Módulos integrados',   color:'text-[#D4920A]' },
  { num:'4',     label:'Lenguas originarias',  color:'text-[#C84B2F]' },
]

// ── CUSTOM CURSOR ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef   = useRef<HTMLDivElement>(null)
  const posRef    = useRef({ x: 0, y: 0 })
  const ringPos   = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top  = e.clientY + 'px'
      }
    }
    let raf: number
    const animate = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px'
        ringRef.current.style.top  = ringPos.current.y + 'px'
      }
      raf = requestAnimationFrame(animate)
    }
    const onEnter = () => {
      cursorRef.current?.classList.add('hover')
      ringRef.current?.classList.add('hover')
    }
    const onLeave = () => {
      cursorRef.current?.classList.remove('hover')
      ringRef.current?.classList.remove('hover')
    }
    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    raf = requestAnimationFrame(animate)
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div id="kuska-cursor" ref={cursorRef} />
      <div id="kuska-cursor-ring" ref={ringRef} />
    </>
  )
}

// ── LOADING SCREEN ────────────────────────────────────────────────────────────
// Marca en sessionStorage para NO mostrar al navegar entre módulos
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [fraseIdx, setFraseIdx] = useState(0)
  const [visible,  setVisible]  = useState(true)
  const [progress, setProgress] = useState(0)
  const [exiting,  setExiting]  = useState(false)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setFraseIdx(i => (i + 1) % FRASES_LOADING.length); setVisible(true) }, 350)
    }, 900)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const pct = Math.min(((Date.now() - start) / 4000) * 100, 100)
      setProgress(pct)
      if (pct < 100) requestAnimationFrame(tick)
      else {
        setExiting(true)
        sessionStorage.setItem('kuska_loaded', '1')
        setTimeout(onComplete, 600)
      }
    }
    requestAnimationFrame(tick)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1A0A00]"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-15"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            style={{
              width: `${40 + i * 15}px`,
              height: `${40 + i * 15}px`,
              left: `${(i * 37) % 100}%`,
              top:  `${(i * 23) % 100}%`,
              background: i % 3 === 0 ? '#C84B2F' : i % 3 === 1 ? '#2E7A6E' : '#D4920A',
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative mb-8"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 rounded-2xl bg-[#D4920A] blur-xl opacity-30 scale-110" />
        <Image src="/images/logo.jpeg" alt="Kuska" width={96} height={96} className="relative rounded-2xl shadow-2xl" priority />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-6xl font-bold text-white tracking-[0.2em] mb-4"
        style={{ fontFamily: 'serif' }}
      >
        KUSKA
      </motion.h1>

      <p className={`text-[#D4920A] text-base tracking-wide mb-12 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {FRASES_LOADING[fraseIdx]}
      </p>

      <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #C84B2F, #D4920A, #2E7A6E)' }}
        />
      </div>
      <p className="text-white/30 text-xs mt-3 tracking-widest">{Math.round(progress)}%</p>
    </motion.div>
  )
}

// ── TYPEWRITER ────────────────────────────────────────────────────────────────
function Typewriter({ text, delay = 55, className = '', onDone }: {
  text: string; delay?: number; className?: string; onDone?: () => void
}) {
  const [displayed,  setDisplayed]  = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1)); i++
      if (i >= text.length) {
        clearInterval(iv)
        onDone?.()
        setTimeout(() => setShowCursor(false), 2500)
      }
    }, delay)
    return () => clearInterval(iv)
  }, [text, delay, onDone])

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-[3px] h-[0.85em] bg-[#D4920A] ml-1 align-middle"
        />
      )}
    </span>
  )
}

// ── 3D PARALLAX CARD ─────────────────────────────────────────────────────────
function Card3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref        = useRef<HTMLDivElement>(null)
  const rotateX    = useMotionValue(0)
  const rotateY    = useMotionValue(0)
  const springX    = useSpring(rotateX, { stiffness: 150, damping: 20 })
  const springY    = useSpring(rotateY, { stiffness: 150, damping: 20 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    rotateX.set(-y * 12)
    rotateY.set( x * 12)
  }

  const onMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── REVEAL ON SCROLL ──────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-cream shadow-[0_4px_24px_rgba(61,28,2,0.1)] py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/images/logo.jpeg" alt="Kuska" width={38} height={38} className="rounded-xl" />
          <span
            className={`text-xl font-bold transition-colors duration-300 ${scrolled ? 'text-[#3D1C02]' : 'text-white'}`}
            style={{ fontFamily: 'serif' }}
          >
            Kuska
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[['Marketplace','/marketplace'],['Artesanos','#artesanos'],['Módulos','#modulos'],['Nosotros','#nosotros']].map(([label,href]) => (
            <Link
              key={label}
              href={href}
              className={`text-sm font-medium transition-all duration-200 hover:text-[#C84B2F] relative group ${
                scrolled ? 'text-[#3D1C02]/70' : 'text-white/80'
              }`}
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#C84B2F] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <select
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all focus:outline-none ${
              scrolled
                ? 'bg-white border-[#3D1C02]/15 text-[#3D1C02]'
                : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            <option>Español</option>
            <option>Qichwa</option>
            <option>Aymara</option>
            <option>Awajún</option>
          </select>
          <Link
            href="/login"
            className={`text-sm font-medium transition-colors ${scrolled ? 'text-[#3D1C02]' : 'text-white'} hover:text-[#C84B2F]`}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="text-sm font-semibold bg-[#C84B2F] text-white px-4 py-2 rounded-xl hover:bg-[#A83A22] transition-all hover:shadow-lg hover:scale-105"
          >
            Registrarse
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-2 ${scrolled ? 'text-[#3D1C02]' : 'text-white'}`}>
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-cream border-t border-[#3D1C02]/10 px-4 py-4 flex flex-col gap-3 overflow-hidden"
          >
            {[['Marketplace','/marketplace'],['Módulos','#modulos']].map(([label,href]) => (
              <Link key={label} href={href} className="text-sm font-medium text-[#3D1C02]/70 hover:text-[#C84B2F] py-1">
                {label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 border-t border-[#3D1C02]/10">
              <Link href="/login" className="flex-1 text-center text-sm font-medium text-[#3D1C02] border border-[#3D1C02]/20 py-2 rounded-xl hover:border-[#C84B2F] hover:text-[#C84B2F] transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/registro" className="flex-1 text-center text-sm font-semibold bg-[#C84B2F] text-white py-2 rounded-xl hover:bg-[#A83A22] transition-colors">
                Registrarse
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ── BUSCADOR ──────────────────────────────────────────────────────────────────
function FiltrosBuscador() {
  const [region, setRegion] = useState('')
  const [rubro,  setRubro]  = useState('')
  const [query,  setQuery]  = useState('')

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(61,28,2,0.12)] p-5 sm:p-6 border border-[#3D1C02]/8">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#3D1C02]/50 mb-4">
        Encuentra artesanos y productos en todo el Perú
      </h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D1C02]/40">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre, técnica, artesano..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#3D1C02]/15 text-sm text-[#3D1C02] placeholder:text-[#3D1C02]/40 focus:outline-none focus:ring-2 focus:ring-[#C84B2F]/30 focus:border-[#C84B2F] transition-all bg-[#F5F0E8]/50"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D1C02]/40 pointer-events-none">📍</span>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="pl-9 pr-8 py-3 rounded-xl border border-[#3D1C02]/15 text-sm text-[#3D1C02] bg-[#F5F0E8]/50 focus:outline-none focus:ring-2 focus:ring-[#C84B2F]/30 focus:border-[#C84B2F] transition-all appearance-none min-w-[170px]"
          >
            {REGIONES.map(r => <option key={r}>{r}</option>)}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D1C02]/40 pointer-events-none text-xs">▾</span>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D1C02]/40 pointer-events-none">🏷️</span>
          <select
            value={rubro}
            onChange={e => setRubro(e.target.value)}
            className="pl-9 pr-8 py-3 rounded-xl border border-[#3D1C02]/15 text-sm text-[#3D1C02] bg-[#F5F0E8]/50 focus:outline-none focus:ring-2 focus:ring-[#C84B2F]/30 focus:border-[#C84B2F] transition-all appearance-none min-w-[170px]"
          >
            {RUBROS.map(r => <option key={r}>{r}</option>)}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D1C02]/40 pointer-events-none text-xs">▾</span>
        </div>
        <Link
          href={`/marketplace?q=${query}&region=${region}&rubro=${rubro}`}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg text-sm whitespace-nowrap"
        >
          Buscar →
        </Link>
      </div>
    </div>
  )
}

// ── HERO PARALLAX ─────────────────────────────────────────────────────────────
function HeroParallax() {
  const ref           = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y1  = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const y2  = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const [subtitleVisible, setSubtitleVisible] = useState(false)

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white px-4"
      style={{ background: 'linear-gradient(135deg, #1A0A00 0%, #3D1C02 100%)' }}
    >
      {/* Parallax orbs */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#C84B2F] blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#2E7A6E] blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D4920A] blur-3xl"
        />
      </motion.div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#D4920A 1px, transparent 1px), linear-gradient(90deg, #D4920A 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <motion.div style={{ y: y2, opacity }} className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#D4920A] font-medium mb-8 border border-[#D4920A]/20"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#D4920A]"
          />
          Primera plataforma nacional de innovación artesanal
        </motion.div>

        {/* Logo 3D */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
          style={{ perspective: 800 }}
        >
          <Card3D>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-[#D4920A] blur-2xl opacity-40 scale-110" />
              <Image
                src="/images/logo.jpeg"
                alt="Kuska"
                width={110}
                height={110}
                className="relative rounded-2xl shadow-2xl ring-4 ring-white/10"
                priority
              />
            </motion.div>
          </Card3D>
        </motion.div>

        {/* Title typewriter */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight min-h-[1.2em]"
          style={{ fontFamily: 'serif' }}
        >
          <Typewriter
            text="Bienvenido a Kuska"
            delay={60}
            className="gradient-text"
            onDone={() => setTimeout(() => setSubtitleVisible(true), 300)}
          />
        </h1>

        <AnimatePresence>
          {subtitleVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xl sm:text-2xl text-white/70 mb-4 font-light">
                Conectamos historias, cultura y oportunidades
              </p>

              <div className="flex items-center justify-center gap-4 mb-12">
                {[['Apoya','#C84B2F'],['Conoce','#2E7A6E'],['Transforma','#D4920A']].map(([t,c],i) => (
                  <span key={t} className="flex items-center gap-4">
                    <span className="font-bold text-lg" style={{ color: c }}>{t}</span>
                    {i < 2 && <span className="text-white/20">·</span>}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/registro"
                    className="group relative flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[#C84B2F] text-white font-bold rounded-2xl hover:bg-[#A83A22] transition-colors text-base overflow-hidden shadow-[0_8px_32px_rgba(200,75,47,0.4)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🛠️ Soy artesano
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                    <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/registro"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-white font-bold rounded-2xl transition-all text-base border border-white/20"
                    style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
                  >
                    🛍️ Soy cliente
                  </Link>
                </motion.div>
              </div>

              <Link
                href="/marketplace"
                className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
              >
                Explorar sin registrarme →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Descubre</span>
        <span className="text-white/40 text-xl">↓</span>
      </motion.div>
    </section>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [loading, setLoading] = useState(false)
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    // Mostrar loading SOLO si es primera visita o recarga (F5)
    // sessionStorage se borra al cerrar la pestaña pero persiste en navegación SPA
    const alreadyLoaded = sessionStorage.getItem('kuska_loaded')
    if (!alreadyLoaded) {
      setLoading(true)
    } else {
      setReady(true)
    }
  }, [])

  const handleComplete = useCallback(() => {
    setLoading(false)
    setReady(true)
  }, [])

  return (
    <>
      <CustomCursor />

      <AnimatePresence>{loading && <LoadingScreen onComplete={handleComplete} />}</AnimatePresence>

      {ready && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar />

          {/* HERO con parallax 3D */}
          <HeroParallax />

          {/* STATS */}
          <section className="bg-white border-y border-[#3D1C02]/8">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#3D1C02]/8">
              {STATS.map((s, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="py-10 text-center px-4 group hover:bg-[#F5F0E8]/50 transition-colors duration-300">
                    <motion.p
                      whileHover={{ scale: 1.1 }}
                      className={`text-4xl md:text-5xl font-bold ${s.color}`}
                      style={{ fontFamily: 'serif' }}
                    >
                      {s.num}
                    </motion.p>
                    <p className="text-sm text-[#3D1C02]/50 mt-2">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* BUSCADOR */}
          <section className="py-20 px-4 bg-[#F5F0E8]" id="artesanos">
            <div className="max-w-5xl mx-auto">
              <Reveal>
                <div className="text-center mb-10">
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#C84B2F] mb-3 bg-[#C84B2F]/10 px-4 py-1.5 rounded-full">
                    Marketplace Nacional
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#3D1C02] mb-3" style={{ fontFamily: 'serif' }}>
                    Encuentra artesanos en todo el Perú
                  </h2>
                  <p className="text-[#3D1C02]/60 max-w-xl mx-auto">
                    Filtra por región, distrito, tipo de artesanía y linaje cultural.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={150}><FiltrosBuscador /></Reveal>
            </div>
          </section>

          {/* CATEGORÍAS con 3D cards */}
          <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#3D1C02] mb-3" style={{ fontFamily: 'serif' }}>
                    Explora por categoría
                  </h2>
                  <p className="text-[#3D1C02]/60">Del tejido andino a la filigrana de plata</p>
                </div>
              </Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIAS.map((cat, i) => (
                  <Reveal key={cat.nombre} delay={i * 60}>
                    <Card3D>
                      <Link href={`/marketplace?rubro=${cat.nombre}`} data-hover>
                        <motion.div
                          whileHover={{ y: -8, boxShadow: '0 16px 48px rgba(61,28,2,0.18)' }}
                          transition={{ duration: 0.25 }}
                          className={`relative bg-gradient-to-br ${cat.color} rounded-2xl p-5 border ${cat.border} transition-colors duration-300 overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors duration-300 rounded-2xl" />
                          <span className="text-4xl block mb-3">{cat.icon}</span>
                          <p className="font-bold text-[#3D1C02] text-sm mb-1">{cat.nombre}</p>
                          <p className="text-xs text-[#3D1C02]/50 mb-3 leading-relaxed">{cat.desc}</p>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat.badge}`}>Ver →</span>
                        </motion.div>
                      </Link>
                    </Card3D>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* MÓDULOS */}
          <section className="py-24 px-4 bg-[#3D1C02] relative overflow-hidden" id="modulos">
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle, #D4920A 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            <div className="max-w-6xl mx-auto relative">
              <Reveal>
                <div className="text-center mb-16">
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#D4920A] mb-4 bg-[#D4920A]/10 px-4 py-1.5 rounded-full border border-[#D4920A]/20">
                    Ecosistema completo
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'serif' }}>
                    12 módulos integrados
                  </h2>
                  <p className="text-white/50 max-w-xl mx-auto">
                    Diseñados bajo ISO 13407 para usuarios rurales con baja conectividad
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {MODULOS.map((m, i) => (
                  <Reveal key={m.n} delay={i * 50}>
                    <motion.div
                      data-hover
                      whileHover={{ y: -6, backgroundColor: 'rgba(255,255,255,0.12)' }}
                      transition={{ duration: 0.2 }}
                      className="group bg-white/5 border border-white/10 rounded-2xl p-5 cursor-default"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center text-white text-xs font-bold`}>
                          {m.n}
                        </div>
                        <span className="text-2xl">{m.icon}</span>
                      </div>
                      <p className="font-bold text-white text-sm mb-1.5 group-hover:text-[#D4920A] transition-colors">
                        {m.titulo}
                      </p>
                      <p className="text-white/40 text-xs leading-relaxed">{m.desc}</p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* DOS MUNDOS — glassmorphism */}
          <section className="py-24 px-4 bg-[#F5F0E8]">
            <div className="max-w-5xl mx-auto">
              <Reveal>
                <div className="text-center mb-14">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#3D1C02] mb-3" style={{ fontFamily: 'serif' }}>
                    Una plataforma, dos mundos
                  </h2>
                  <p className="text-[#3D1C02]/60">Experiencias diseñadas para cada usuario</p>
                </div>
              </Reveal>

              <div className="grid md:grid-cols-2 gap-6">
                <Reveal delay={100}>
                  <Card3D>
                    <motion.div
                      whileHover={{ y: -6, boxShadow: '0 24px 64px rgba(61,28,2,0.3)' }}
                      transition={{ duration: 0.25 }}
                      className="relative rounded-3xl p-8 overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #3D1C02, #5a2d0c)' }}
                    >
                      {/* Glassmorphism inner panel */}
                      <div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(200,75,47,0.12) 0%, transparent 60%)',
                          backdropFilter: 'blur(2px)',
                        }}
                      />
                      <div className="absolute top-0 right-0 w-40 h-40 bg-[#C84B2F] opacity-15 rounded-full blur-2xl" />
                      <div className="relative">
                        <span className="text-5xl block mb-4">🛠️</span>
                        <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'serif' }}>Soy artesano</h3>
                        <p className="text-white/60 text-sm mb-6">Digitaliza tu negocio, preserva tu historia y llega a todo el Perú</p>
                        <ul className="space-y-2 mb-8">
                          {['Perfil verificado con RENIEC','Marketplace con filtros por región','CFO-bot para tus finanzas','Historia con Módulo Raíces','Academia Kuska gratuita'].map(item => (
                            <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4920A] flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                          <Link
                            href="/registro"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C84B2F] text-white font-bold rounded-xl hover:bg-[#A83A22] transition-colors text-sm shadow-[0_4px_20px_rgba(200,75,47,0.4)]"
                          >
                            Registrarme como artesano →
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  </Card3D>
                </Reveal>

                <Reveal delay={200}>
                  <Card3D>
                    <motion.div
                      whileHover={{ y: -6, boxShadow: '0 24px 64px rgba(46,122,110,0.3)' }}
                      transition={{ duration: 0.25 }}
                      className="relative rounded-3xl p-8 overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #2E7A6E, #1a5049)' }}
                    >
                      <div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(212,146,10,0.12) 0%, transparent 60%)',
                        }}
                      />
                      <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4920A] opacity-15 rounded-full blur-2xl" />
                      <div className="relative">
                        <span className="text-5xl block mb-4">🛍️</span>
                        <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'serif' }}>Soy cliente</h3>
                        <p className="text-white/60 text-sm mb-6">Descubre piezas únicas con historia, directamente de sus creadores</p>
                        <ul className="space-y-2 mb-8">
                          {['Filtros por región y linaje cultural','Historia detrás de cada pieza','Compra directa al artesano','Entrega en puntos comunitarios','Ferias digitales en vivo'].map(item => (
                            <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4920A] flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                          <Link
                            href="/marketplace"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 border border-white/30 text-white font-bold rounded-xl hover:bg-white/25 transition-colors text-sm"
                            style={{ backdropFilter: 'blur(12px)' }}
                          >
                            Explorar el marketplace →
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  </Card3D>
                </Reveal>
              </div>
            </div>
          </section>

          {/* CTA FINAL */}
          <section
            className="py-24 px-4 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1A0A00 0%, #3D1C02 100%)' }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute top-0 left-0 w-96 h-96 bg-[#C84B2F] rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
              transition={{ duration: 6, repeat: Infinity, delay: 3 }}
              className="absolute bottom-0 right-0 w-80 h-80 bg-[#D4920A] rounded-full blur-3xl pointer-events-none"
            />

            <Reveal>
              <div className="max-w-3xl mx-auto text-center relative">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Image src="/images/logo.jpeg" alt="Kuska" width={64} height={64} className="rounded-xl mx-auto mb-6 shadow-2xl" />
                </motion.div>

                {/* Glassmorphism card */}
                <div
                  className="rounded-3xl p-8 mb-8 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'serif' }}>
                    ¿Listo para ser parte de Kuska?
                  </h2>
                  <p className="text-white/60 text-lg max-w-xl mx-auto">
                    Solo S/10 de inscripción para artesanos. Sin mensualidades.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/registro"
                      className="group w-full sm:w-auto px-10 py-4 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-bold rounded-2xl transition-colors text-base shadow-[0_8px_32px_rgba(200,75,47,0.4)] relative overflow-hidden"
                    >
                      <span className="relative z-10">Registrarme ahora →</span>
                      <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/marketplace"
                      className="w-full sm:w-auto px-10 py-4 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors text-base"
                      style={{ backdropFilter: 'blur(12px)' }}
                    >
                      Ver el marketplace
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* FOOTER */}
          <footer className="bg-[#1A0A00] text-white py-14 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Image src="/images/logo.jpeg" alt="Kuska" width={36} height={36} className="rounded-xl" />
                    <span className="font-bold text-lg" style={{ fontFamily: 'serif' }}>Kuska</span>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Primera plataforma nacional de innovación artesanal del Perú.
                  </p>
                  <p className="text-[#D4920A] text-xs mt-3 font-medium">Agencia CEIPE · 2026</p>
                </div>
                {[
                  { title:'Plataforma', links:['Marketplace','Módulo Raíces','Academia Kuska','CFO-bot IA'] },
                  { title:'Artesanos',  links:['Registrarse','Verificación RENIEC','Hub Capitalización','Ferias digitales'] },
                  { title:'Idiomas',    links:['Español','Qichwa','Aymara','Awajún'] },
                ].map(col => (
                  <div key={col.title}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{col.title}</h4>
                    <ul className="space-y-2">
                      {col.links.map(l => (
                        <li key={l}>
                          <Link href="#" className="text-sm text-white/50 hover:text-white transition-colors">{l}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-white/25 text-xs">© 2026 Kuska — Agencia CEIPE. Todos los derechos reservados.</p>
                <p className="text-white/25 text-xs">ISO 13407 · Modo offline disponible · 25 regiones del Perú</p>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </>
  )
}
