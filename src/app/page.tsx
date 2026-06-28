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
} from 'framer-motion'

// Paleta dark-warm: Brown #3D1C02 · Red #C84B2F · Teal #2E7A6E · Gold #D4920A · Cream #F0EAE0

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
  { icon:'🧶', nombre:'Textilería',     desc:'Tejidos, mantas, chullos',     accent:'#D4920A' },
  { icon:'🏺', nombre:'Cerámica',       desc:'Vasijas, figuras, chulucanas', accent:'#C84B2F' },
  { icon:'💍', nombre:'Joyería',        desc:'Plata, oro, filigrana',        accent:'#E8C060' },
  { icon:'🪵', nombre:'Madera',         desc:'Tallado, retablos, máscaras',  accent:'#A07850' },
  { icon:'🧺', nombre:'Cestería',       desc:'Canastas, sombreros, esteras', accent:'#4AA89C' },
  { icon:'🎨', nombre:'Arte & Pintura', desc:'Retablos ayacuchanos',         accent:'#9B72F0' },
  { icon:'🪡', nombre:'Bordados',       desc:'Huancayo, Ayacucho, Cusco',    accent:'#E05C9A' },
  { icon:'🥁', nombre:'Instrumentos',   desc:'Quenas, charangos, zampoñas',  accent:'#3D9B8C' },
]

const MODULOS = [
  { n:'01', icon:'🪪', titulo:'Identidad Digital',    desc:'Validación con RENIEC en tiempo real.',           color:'#C84B2F' },
  { n:'02', icon:'🛒', titulo:'Marketplace Herencia', desc:'Filtros por región, distrito y linaje cultural.', color:'#2E7A6E' },
  { n:'03', icon:'🌿', titulo:'Módulo Raíces',        desc:'Historia de cada pieza en 4 idiomas.',            color:'#D4920A' },
  { n:'04', icon:'🎪', titulo:'Ferias Digitales',     desc:'Eventos virtuales con streaming en vivo.',        color:'#7C3AED' },
  { n:'05', icon:'🤖', titulo:'IA Coordinador',       desc:'Organización inteligente de ferias físicas.',     color:'#2563EB' },
  { n:'06', icon:'💬', titulo:'Red Cuéntame',         desc:'Comunidad interna de artesanos.',                 color:'#DB2777' },
  { n:'07', icon:'🎓', titulo:'Gestor Talleres',      desc:'Clases vivenciales con reservas integradas.',     color:'#EA580C' },
  { n:'08', icon:'🗣️', titulo:'Puente Lingüístico',  desc:'Quechua, Aymara y Awajún sin barreras.',          color:'#059669' },
  { n:'09', icon:'🏆', titulo:'Hub Capitalización',  desc:'Scoring social para atraer inversiones.',         color:'#CA8A04' },
  { n:'10', icon:'📚', titulo:'Academia Kuska',       desc:'Formación con BCP, Intercorp y Romero.',          color:'#4F46E5' },
  { n:'11', icon:'📊', titulo:'CFO-bot IA',           desc:'Contabilidad automatizada con inteligencia.',     color:'#E11D48' },
  { n:'12', icon:'🚚', titulo:'Logística Rural',      desc:'Puntos comunitarios y trazabilidad GPS.',         color:'#475569' },
]

const STATS = [
  { num:'100K+', label:'Artesanos a conectar', color:'#C84B2F' },
  { num:'25',    label:'Regiones del Perú',    color:'#3D9B8C' },
  { num:'12',    label:'Módulos integrados',   color:'#D4920A' },
  { num:'4',     label:'Lenguas originarias',  color:'#C84B2F' },
]

// ── CUSTOM CURSOR ──────────────────────────────────────────────────────────────
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
    const addHover  = () => { cursorRef.current?.classList.add('hover');    ringRef.current?.classList.add('hover') }
    const rmHover   = () => { cursorRef.current?.classList.remove('hover'); ringRef.current?.classList.remove('hover') }
    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', rmHover)
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

// ── LOADING SCREEN ─────────────────────────────────────────────────────────────
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [fraseIdx, setFraseIdx] = useState(0)
  const [visible,  setVisible]  = useState(true)
  const [progress, setProgress] = useState(0)
  const [exiting,  setExiting]  = useState(false)

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setFraseIdx(i => (i + 1) % FRASES_LOADING.length); setVisible(true) }, 320)
    }, 850)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const pct = Math.min(((Date.now() - start) / 3000) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        requestAnimationFrame(tick)
      } else {
        setExiting(true)
        sessionStorage.setItem('kuska_loaded', '1')
        setTimeout(onComplete, 480)
      }
    }
    requestAnimationFrame(tick)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#060402' }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {([
          { bg:'#C84B2F', l:'8%',  t:'15%', s:180 },
          { bg:'#2E7A6E', l:'75%', t:'60%', s:220 },
          { bg:'#D4920A', l:'45%', t:'40%', s:300 },
          { bg:'#C84B2F', l:'60%', t:'10%', s:140 },
          { bg:'#2E7A6E', l:'20%', t:'70%', s:160 },
        ] as const).map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            animate={{ opacity: [0.06, 0.13, 0.06], scale: [1, 1.15, 1] }}
            transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            style={{
              left: b.l, top: b.t,
              width: b.s, height: b.s,
              background: b.bg,
              filter: 'blur(60px)',
              transform: 'translate(-50%,-50%)',
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        className="relative mb-7"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="absolute inset-0 rounded-3xl scale-110 blur-2xl opacity-30"
          style={{ background: '#D4920A' }}
        />
        <Image
          src="/images/logo.jpeg"
          alt="Kuska"
          width={84}
          height={84}
          className="relative rounded-3xl shadow-2xl ring-1 ring-white/8"
          priority
        />
      </motion.div>

      {/* Brand */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-5xl font-bold text-[#F0EAE0] tracking-[0.28em] mb-4"
        style={{ fontFamily: 'serif' }}
      >
        KUSKA
      </motion.h1>

      {/* Rotating phrase */}
      <p
        className="text-sm tracking-wide mb-14 transition-all duration-300"
        style={{
          color: '#D4920A',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(5px)',
        }}
      >
        {FRASES_LOADING[fraseIdx]}
      </p>

      {/* Progress */}
      <div
        className="w-52 rounded-full overflow-hidden"
        style={{ height: '1.5px', background: 'rgba(240,234,224,0.08)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #C84B2F, #D4920A, #3D9B8C)',
            transition: 'width 80ms linear',
          }}
        />
      </div>
      <p
        className="mt-3 text-xs tracking-[0.2em]"
        style={{ color: 'rgba(240,234,224,0.22)' }}
      >
        {Math.round(progress)}%
      </p>
    </motion.div>
  )
}

// ── TYPEWRITER ─────────────────────────────────────────────────────────────────
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
        setTimeout(() => setShowCursor(false), 2200)
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
          transition={{ duration: 0.9, repeat: Infinity }}
          className="inline-block w-[2px] h-[0.78em] bg-[#D4920A] ml-1 align-middle"
        />
      )}
    </span>
  )
}

// ── 3D CARD ────────────────────────────────────────────────────────────────────
function Card3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref     = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 140, damping: 18 })
  const springY = useSpring(rotateY, { stiffness: 140, damping: 18 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rotateX.set(-((e.clientY - rect.top)  / rect.height - 0.5) * 9)
    rotateY.set( ((e.clientX - rect.left) / rect.width  - 0.5) * 9)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0) }}
      style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── REVEAL ─────────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-56px' }}
      transition={{ duration: 0.58, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── NAVBAR ─────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-cream shadow-[0_1px_0_rgba(240,234,224,0.05)] py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.jpeg" alt="Kuska" width={35} height={35} className="rounded-xl" />
          <span className="text-xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'serif' }}>Kuska</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            ['Marketplace', '/marketplace'],
            ['Artesanos',   '#artesanos'],
            ['Módulos',     '#modulos'],
            ['Nosotros',    '#nosotros'],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-[#F0EAE0]/50 hover:text-[#F0EAE0] transition-colors duration-200 relative group"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#C84B2F] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <select
            className="text-xs px-3 py-1.5 rounded-lg text-[#F0EAE0]/50 focus:outline-none focus:text-[#F0EAE0] transition-colors"
            style={{ background: 'rgba(240,234,224,0.05)', border: '1px solid rgba(240,234,224,0.08)' }}
          >
            <option style={{ background: '#1A1208' }}>Español</option>
            <option style={{ background: '#1A1208' }}>Qichwa</option>
            <option style={{ background: '#1A1208' }}>Aymara</option>
            <option style={{ background: '#1A1208' }}>Awajún</option>
          </select>
          <Link
            href="/login"
            className="text-sm font-medium text-[#F0EAE0]/65 hover:text-[#F0EAE0] transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="text-sm font-semibold bg-[#C84B2F] text-white px-4 py-2 rounded-xl hover:bg-[#A83A22] transition-all hover:shadow-[0_4px_16px_rgba(200,75,47,0.4)] hover:scale-[1.03]"
          >
            Registrarse
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-[#F0EAE0]/65 hover:text-[#F0EAE0] transition-colors"
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <span className={`block h-px bg-current rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px bg-current rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-current rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-cream px-4 py-4 flex flex-col gap-3 overflow-hidden"
            style={{ borderTop: '1px solid rgba(240,234,224,0.06)' }}
          >
            {[['Marketplace','/marketplace'],['Módulos','#modulos']].map(([label,href]) => (
              <Link key={label} href={href} className="text-sm font-medium text-[#F0EAE0]/55 hover:text-[#F0EAE0] py-1 transition-colors">
                {label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid rgba(240,234,224,0.06)' }}>
              <Link href="/login" className="flex-1 text-center text-sm font-medium text-[#F0EAE0]/65 py-2 rounded-xl border border-white/10 hover:border-white/20 hover:text-[#F0EAE0] transition-all">
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

// ── BUSCADOR ───────────────────────────────────────────────────────────────────
function FiltrosBuscador() {
  const [region, setRegion] = useState('')
  const [rubro,  setRubro]  = useState('')
  const [query,  setQuery]  = useState('')

  const fieldBase = {
    display: 'flex', alignItems: 'center', position: 'relative' as const,
    background: 'rgba(240,234,224,0.04)',
    border: '1px solid rgba(240,234,224,0.08)',
    borderRadius: '0.75rem',
  }

  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{ background: 'rgba(240,234,224,0.03)', border: '1px solid rgba(240,234,224,0.07)', backdropFilter: 'blur(16px)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(240,234,224,0.28)' }}>
        Encuentra artesanos y productos en todo el Perú
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="flex-1 relative" style={fieldBase}>
          <span className="absolute left-3 text-sm pointer-events-none" style={{ color: 'rgba(240,234,224,0.3)' }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre, técnica, artesano..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-transparent focus:outline-none"
            style={{ color: '#F0EAE0' }}
          />
        </div>

        {/* Región */}
        <div className="relative" style={fieldBase}>
          <span className="absolute left-3 text-sm pointer-events-none z-10" style={{ color: 'rgba(240,234,224,0.3)' }}>📍</span>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="pl-9 pr-8 py-3 text-sm bg-transparent focus:outline-none appearance-none min-w-[168px]"
            style={{ color: region ? '#F0EAE0' : 'rgba(240,234,224,0.45)' }}
          >
            {REGIONES.map(r => <option key={r} style={{ background: '#1A1208', color: '#F0EAE0' }}>{r}</option>)}
          </select>
          <span className="absolute right-3 text-xs pointer-events-none" style={{ color: 'rgba(240,234,224,0.3)' }}>▾</span>
        </div>

        {/* Rubro */}
        <div className="relative" style={fieldBase}>
          <span className="absolute left-3 text-sm pointer-events-none z-10" style={{ color: 'rgba(240,234,224,0.3)' }}>🏷️</span>
          <select
            value={rubro}
            onChange={e => setRubro(e.target.value)}
            className="pl-9 pr-8 py-3 text-sm bg-transparent focus:outline-none appearance-none min-w-[168px]"
            style={{ color: rubro ? '#F0EAE0' : 'rgba(240,234,224,0.45)' }}
          >
            {RUBROS.map(r => <option key={r} style={{ background: '#1A1208', color: '#F0EAE0' }}>{r}</option>)}
          </select>
          <span className="absolute right-3 text-xs pointer-events-none" style={{ color: 'rgba(240,234,224,0.3)' }}>▾</span>
        </div>

        <Link
          href={`/marketplace?q=${encodeURIComponent(query)}&region=${encodeURIComponent(region)}&rubro=${encodeURIComponent(rubro)}`}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold rounded-xl transition-all hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(200,75,47,0.4)] text-sm whitespace-nowrap"
        >
          Buscar →
        </Link>
      </div>
    </div>
  )
}

// ── HERO PARALLAX ──────────────────────────────────────────────────────────────
function HeroParallax() {
  const ref                 = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y1      = useTransform(scrollYProgress, [0, 1], ['0%', '42%'])
  const y2      = useTransform(scrollYProgress, [0, 1], ['0%', '26%'])
  const opacity = useTransform(scrollYProgress, [0, 0.62], [1, 0])
  const [subtitleVisible, setSubtitleVisible] = useState(false)

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: 'linear-gradient(150deg, #050302 0%, #120A04 60%, #0A0604 100%)' }}
    >
      {/* Parallax ambient layer */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.07, 0.15, 0.07] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4"
          style={{ width: 480, height: 480, background: '#C84B2F', filter: 'blur(90px)', borderRadius: '50%' }}
        />
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
          className="absolute bottom-1/4 right-1/4"
          style={{ width: 380, height: 380, background: '#2E7A6E', filter: 'blur(90px)', borderRadius: '50%' }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 640, height: 640, background: '#D4920A', filter: 'blur(110px)', borderRadius: '50%' }}
        />
      </motion.div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(212,146,10,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,146,10,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.03,
        }}
      />

      {/* Content */}
      <motion.div style={{ y: y2, opacity }} className="relative z-10 max-w-5xl mx-auto text-center text-[#F0EAE0]">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-10 border"
          style={{
            color: '#D4920A',
            background: 'rgba(212,146,10,0.07)',
            borderColor: 'rgba(212,146,10,0.14)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-[#D4920A]"
          />
          Primera plataforma nacional de innovación artesanal
        </motion.div>

        {/* 3D Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, rotateY: -12 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-10"
          style={{ perspective: 800 }}
        >
          <Card3D>
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div
                className="absolute inset-0 rounded-3xl scale-110 blur-2xl opacity-30"
                style={{ background: '#D4920A' }}
              />
              <Image
                src="/images/logo.jpeg"
                alt="Kuska"
                width={104}
                height={104}
                className="relative rounded-3xl shadow-2xl ring-1 ring-white/6"
                priority
              />
            </motion.div>
          </Card3D>
        </motion.div>

        {/* Title */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-none min-h-[1.1em]"
          style={{ fontFamily: 'serif' }}
        >
          <Typewriter
            text="Bienvenido a Kuska"
            delay={55}
            className="gradient-text"
            onDone={() => setTimeout(() => setSubtitleVisible(true), 240)}
          />
        </h1>

        <AnimatePresence>
          {subtitleVisible && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xl sm:text-2xl font-light tracking-wide mb-6" style={{ color: 'rgba(240,234,224,0.52)' }}>
                Conectamos historias, cultura y oportunidades
              </p>

              <div className="flex items-center justify-center gap-5 mb-12">
                {[['Apoya','#C84B2F'],['Conoce','#3D9B8C'],['Transforma','#D4920A']].map(([t,c],i) => (
                  <span key={t} className="flex items-center gap-5">
                    <span className="font-semibold text-base tracking-wide" style={{ color: c }}>{t}</span>
                    {i < 2 && <span style={{ color: 'rgba(240,234,224,0.14)' }}>·</span>}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/registro"
                    className="group relative flex items-center gap-2 px-8 py-4 bg-[#C84B2F] text-white font-bold rounded-2xl hover:bg-[#A83A22] transition-colors text-base overflow-hidden shadow-[0_8px_32px_rgba(200,75,47,0.32)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🛠️ Soy artesano
                      <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                    </span>
                    <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/registro"
                    className="flex items-center gap-2 px-8 py-4 text-[#F0EAE0] font-bold rounded-2xl transition-all text-base border border-white/10 hover:border-white/18 hover:bg-white/3"
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    🛍️ Soy cliente
                  </Link>
                </motion.div>
              </div>

              <Link
                href="/marketplace"
                className="text-sm text-[#F0EAE0]/28 hover:text-[#F0EAE0]/55 transition-colors underline underline-offset-4"
              >
                Explorar sin registrarme →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(240,234,224,0.2)' }}>Descubre</span>
        <div
          className="w-px h-7 rounded-full"
          style={{ background: 'linear-gradient(to bottom, rgba(212,146,10,0.4), transparent)' }}
        />
      </motion.div>
    </section>
  )
}

// ── PAGE ───────────────────────────────────────────────────────────────────────
export default function Home() {
  // 'init' = esperando hydration (SSR y primer frame)
  // 'loading' = mostrar loading screen
  // 'ready' = mostrar contenido
  const [phase, setPhase] = useState<'init' | 'loading' | 'ready'>('init')

  useEffect(() => {
    // rAF garantiza que corremos después de la hidratación
    requestAnimationFrame(() => {
      const loaded = sessionStorage.getItem('kuska_loaded')
      setPhase(loaded ? 'ready' : 'loading')
    })
  }, [])

  const handleComplete = useCallback(() => setPhase('ready'), [])

  // Durante SSR y el primer frame: null → sin hydration mismatch
  if (phase === 'init') return null

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {phase === 'loading' && (
          <LoadingScreen key="loader" onComplete={handleComplete} />
        )}
      </AnimatePresence>

      {phase === 'ready' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.38 }}
        >
          <Navbar />

          {/* ── HERO ── */}
          <HeroParallax />

          {/* ── STATS ── */}
          <section style={{ background: '#0E0907' }} className="border-y border-white/[0.05]">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.05]">
              {STATS.map((s, i) => (
                <Reveal key={s.num} delay={i * 75}>
                  <div className="py-10 px-4 text-center group hover:bg-white/[0.02] transition-colors duration-300">
                    <motion.p
                      whileHover={{ scale: 1.08 }}
                      className="text-4xl md:text-5xl font-bold"
                      style={{ fontFamily: 'serif', color: s.color }}
                    >
                      {s.num}
                    </motion.p>
                    <p className="text-sm mt-2" style={{ color: 'rgba(240,234,224,0.38)' }}>{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── BUSCADOR ── */}
          <section className="py-20 px-4" style={{ background: '#0B0804' }} id="artesanos">
            <div className="max-w-5xl mx-auto">
              <Reveal>
                <div className="text-center mb-10">
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full"
                    style={{ color: '#C84B2F', background: 'rgba(200,75,47,0.08)', border: '1px solid rgba(200,75,47,0.14)' }}
                  >
                    Marketplace Nacional
                  </span>
                  <h2
                    className="text-3xl md:text-4xl font-bold text-[#F0EAE0] mb-3"
                    style={{ fontFamily: 'serif' }}
                  >
                    Encuentra artesanos en todo el Perú
                  </h2>
                  <p style={{ color: 'rgba(240,234,224,0.42)' }}>
                    Filtra por región, distrito, tipo de artesanía y linaje cultural.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={140}><FiltrosBuscador /></Reveal>
            </div>
          </section>

          {/* ── CATEGORÍAS ── */}
          <section className="py-20 px-4" style={{ background: '#100C08' }}>
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="text-center mb-12">
                  <h2
                    className="text-3xl md:text-4xl font-bold text-[#F0EAE0] mb-3"
                    style={{ fontFamily: 'serif' }}
                  >
                    Explora por categoría
                  </h2>
                  <p style={{ color: 'rgba(240,234,224,0.38)' }}>Del tejido andino a la filigrana de plata</p>
                </div>
              </Reveal>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIAS.map((cat, i) => (
                  <Reveal key={cat.nombre} delay={i * 52}>
                    <Card3D>
                      <Link href={`/marketplace?rubro=${cat.nombre}`} data-hover>
                        <motion.div
                          whileHover={{
                            y: -6,
                            boxShadow: `0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px ${cat.accent}20`,
                          }}
                          transition={{ duration: 0.22 }}
                          className="relative rounded-2xl p-5 overflow-hidden"
                          style={{
                            background: '#1A1208',
                            border: '1px solid rgba(240,234,224,0.06)',
                            borderTop: `2px solid ${cat.accent}`,
                          }}
                        >
                          <div
                            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                            style={{ background: `radial-gradient(ellipse at 50% 0%, ${cat.accent}0C 0%, transparent 65%)` }}
                          />
                          <span className="text-3xl block mb-3">{cat.icon}</span>
                          <p className="font-bold text-[#F0EAE0] text-sm mb-1">{cat.nombre}</p>
                          <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(240,234,224,0.38)' }}>{cat.desc}</p>
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: `${cat.accent}18`, color: cat.accent }}
                          >
                            Ver →
                          </span>
                        </motion.div>
                      </Link>
                    </Card3D>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── MÓDULOS ── */}
          <section className="py-24 px-4 relative overflow-hidden" style={{ background: '#070503' }} id="modulos">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(212,146,10,0.6) 1px, transparent 1px)',
                backgroundSize: '44px 44px',
                opacity: 0.022,
              }}
            />
            <div className="max-w-6xl mx-auto relative">
              <Reveal>
                <div className="text-center mb-16">
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
                    style={{ color: '#D4920A', background: 'rgba(212,146,10,0.06)', border: '1px solid rgba(212,146,10,0.14)' }}
                  >
                    Ecosistema completo
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#F0EAE0] mb-4" style={{ fontFamily: 'serif' }}>
                    12 módulos integrados
                  </h2>
                  <p style={{ color: 'rgba(240,234,224,0.34)' }}>
                    Diseñados bajo ISO 13407 para usuarios rurales con baja conectividad
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {MODULOS.map((m, i) => (
                  <Reveal key={m.n} delay={i * 42}>
                    <motion.div
                      data-hover
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="group rounded-2xl p-5 border border-white/[0.05] hover:border-white/[0.09] transition-colors duration-200"
                      style={{ background: 'rgba(240,234,224,0.02)' }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: m.color }}
                        >
                          {m.n}
                        </div>
                        <span className="text-xl">{m.icon}</span>
                      </div>
                      <p className="font-semibold text-[#F0EAE0] text-sm mb-1.5 group-hover:text-[#D4920A] transition-colors duration-200">
                        {m.titulo}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,234,224,0.33)' }}>{m.desc}</p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── DOS MUNDOS ── */}
          <section className="py-24 px-4" style={{ background: '#0F0A06' }} id="nosotros">
            <div className="max-w-5xl mx-auto">
              <Reveal>
                <div className="text-center mb-14">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#F0EAE0] mb-3" style={{ fontFamily: 'serif' }}>
                    Una plataforma, dos mundos
                  </h2>
                  <p style={{ color: 'rgba(240,234,224,0.38)' }}>Experiencias diseñadas para cada usuario</p>
                </div>
              </Reveal>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Artesano */}
                <Reveal delay={80}>
                  <Card3D>
                    <motion.div
                      whileHover={{ y: -6, boxShadow: '0 24px 64px rgba(200,75,47,0.18)' }}
                      transition={{ duration: 0.25 }}
                      className="relative rounded-3xl p-8 overflow-hidden border border-white/5"
                      style={{ background: 'linear-gradient(135deg, #1C0E06 0%, #2A1608 100%)' }}
                    >
                      <div
                        className="absolute top-0 right-0 w-52 h-52 rounded-full opacity-[0.09] pointer-events-none"
                        style={{ background: '#C84B2F', filter: 'blur(50px)' }}
                      />
                      <div className="relative">
                        <span className="text-5xl block mb-5">🛠️</span>
                        <h3 className="text-2xl font-bold text-[#F0EAE0] mb-2" style={{ fontFamily: 'serif' }}>Soy artesano</h3>
                        <p className="text-sm mb-6" style={{ color: 'rgba(240,234,224,0.48)' }}>
                          Digitaliza tu negocio, preserva tu historia y llega a todo el Perú
                        </p>
                        <ul className="space-y-2.5 mb-8">
                          {['Perfil verificado con RENIEC','Marketplace con filtros por región','CFO-bot para tus finanzas','Historia con Módulo Raíces','Academia Kuska gratuita'].map(item => (
                            <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(240,234,224,0.62)' }}>
                              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#D4920A' }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                          <Link
                            href="/registro"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C84B2F] text-white font-bold rounded-xl hover:bg-[#A83A22] transition-colors text-sm shadow-[0_4px_20px_rgba(200,75,47,0.32)]"
                          >
                            Registrarme como artesano →
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  </Card3D>
                </Reveal>

                {/* Cliente */}
                <Reveal delay={170}>
                  <Card3D>
                    <motion.div
                      whileHover={{ y: -6, boxShadow: '0 24px 64px rgba(46,122,110,0.18)' }}
                      transition={{ duration: 0.25 }}
                      className="relative rounded-3xl p-8 overflow-hidden border border-white/5"
                      style={{ background: 'linear-gradient(135deg, #0B1C19 0%, #0F2820 100%)' }}
                    >
                      <div
                        className="absolute top-0 right-0 w-52 h-52 rounded-full opacity-[0.09] pointer-events-none"
                        style={{ background: '#D4920A', filter: 'blur(50px)' }}
                      />
                      <div className="relative">
                        <span className="text-5xl block mb-5">🛍️</span>
                        <h3 className="text-2xl font-bold text-[#F0EAE0] mb-2" style={{ fontFamily: 'serif' }}>Soy cliente</h3>
                        <p className="text-sm mb-6" style={{ color: 'rgba(240,234,224,0.48)' }}>
                          Descubre piezas únicas con historia, directamente de sus creadores
                        </p>
                        <ul className="space-y-2.5 mb-8">
                          {['Filtros por región y linaje cultural','Historia detrás de cada pieza','Compra directa al artesano','Entrega en puntos comunitarios','Ferias digitales en vivo'].map(item => (
                            <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(240,234,224,0.62)' }}>
                              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#D4920A' }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                          <Link
                            href="/marketplace"
                            className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-xl text-[#F0EAE0] text-sm border border-white/12 hover:bg-white/4 transition-all"
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

          {/* ── CTA FINAL ── */}
          <section className="py-24 px-4 text-[#F0EAE0] relative overflow-hidden" style={{ background: '#060402' }}>
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.07, 0.13, 0.07] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 left-0 rounded-full pointer-events-none"
              style={{ width: 500, height: 500, background: '#C84B2F', filter: 'blur(90px)' }}
            />
            <motion.div
              animate={{ scale: [1, 1.14, 1], opacity: [0.06, 0.11, 0.06] }}
              transition={{ duration: 7, repeat: Infinity, delay: 3 }}
              className="absolute bottom-0 right-0 rounded-full pointer-events-none"
              style={{ width: 420, height: 420, background: '#D4920A', filter: 'blur(90px)' }}
            />

            <Reveal>
              <div className="max-w-3xl mx-auto text-center relative">
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="mb-8"
                >
                  <Image
                    src="/images/logo.jpeg"
                    alt="Kuska"
                    width={58}
                    height={58}
                    className="rounded-2xl mx-auto shadow-2xl ring-1 ring-white/6"
                  />
                </motion.div>

                <div
                  className="rounded-3xl p-8 sm:p-10 mb-8"
                  style={{
                    background: 'rgba(240,234,224,0.03)',
                    border: '1px solid rgba(240,234,224,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'serif' }}>
                    ¿Listo para ser parte de Kuska?
                  </h2>
                  <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(240,234,224,0.46)' }}>
                    Solo S/10 de inscripción para artesanos. Sin mensualidades.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/registro"
                      className="group relative w-full sm:w-auto px-10 py-4 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-bold rounded-2xl transition-colors text-base shadow-[0_8px_32px_rgba(200,75,47,0.32)] overflow-hidden"
                    >
                      <span className="relative z-10">Registrarme ahora →</span>
                      <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/marketplace"
                      className="w-full sm:w-auto px-10 py-4 border border-white/12 text-[#F0EAE0] font-bold rounded-2xl hover:bg-white/4 transition-all text-base"
                      style={{ backdropFilter: 'blur(12px)' }}
                    >
                      Ver el marketplace
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ── FOOTER ── */}
          <footer
            className="py-14 px-4"
            style={{ background: '#040302', borderTop: '1px solid rgba(240,234,224,0.05)' }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Image src="/images/logo.jpeg" alt="Kuska" width={32} height={32} className="rounded-xl" />
                    <span className="font-bold text-lg text-[#F0EAE0]" style={{ fontFamily: 'serif' }}>Kuska</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,234,224,0.32)' }}>
                    Primera plataforma nacional de innovación artesanal del Perú.
                  </p>
                  <p className="text-xs mt-3 font-medium" style={{ color: '#D4920A' }}>Agencia CEIPE · 2026</p>
                </div>

                {[
                  { title:'Plataforma', links:['Marketplace','Módulo Raíces','Academia Kuska','CFO-bot IA'] },
                  { title:'Artesanos',  links:['Registrarse','Verificación RENIEC','Hub Capitalización','Ferias digitales'] },
                  { title:'Idiomas',    links:['Español','Qichwa','Aymara','Awajún'] },
                ].map(col => (
                  <div key={col.title}>
                    <h4
                      className="text-xs font-bold uppercase tracking-widest mb-4"
                      style={{ color: 'rgba(240,234,224,0.22)' }}
                    >
                      {col.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {col.links.map(l => (
                        <li key={l}>
                          <Link
                            href="#"
                            className="text-sm hover:text-[#F0EAE0] transition-colors duration-200"
                            style={{ color: 'rgba(240,234,224,0.38)' }}
                          >
                            {l}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div
                className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
                style={{ borderTop: '1px solid rgba(240,234,224,0.05)' }}
              >
                <p className="text-xs" style={{ color: 'rgba(240,234,224,0.18)' }}>
                  © 2026 Kuska — Agencia CEIPE. Todos los derechos reservados.
                </p>
                <p className="text-xs" style={{ color: 'rgba(240,234,224,0.18)' }}>
                  ISO 13407 · Modo offline disponible · 25 regiones del Perú
                </p>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </>
  )
}
