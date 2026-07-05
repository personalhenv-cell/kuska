'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { RippleButton } from '@/components/ui/RippleButton'

const floatingWords = [
  { text: 'Kawsay', top: '9%', left: '6%', size: 72 },
  { text: 'Munay', top: '14%', left: '80%', size: 96 },
  { text: 'Away', top: '30%', left: '4%', size: 56 },
  { text: 'Sumaq', top: '20%', left: '48%', size: 64 },
  { text: 'Llaqta', top: '40%', left: '90%', size: 80 },
  { text: 'Hatun', top: '86%', left: '38%', size: 130 },
  { text: 'Sonqo', top: '6%', left: '32%', size: 48 },
  { text: 'Yachay', top: '58%', left: '3%', size: 88 },
  { text: 'Kuyay', top: '68%', left: '85%', size: 60 },
  { text: 'Wayra', top: '48%', left: '20%', size: 52 },
  { text: 'Inti', top: '4%', left: '62%', size: 110 },
  { text: 'Killa', top: '78%', left: '10%', size: 68 },
  { text: 'Sacha', top: '90%', left: '68%', size: 56 },
  { text: 'Puriy', top: '34%', left: '64%', size: 48 },
  { text: 'Rimay', top: '62%', left: '46%', size: 60 },
  { text: 'Yupay', top: '22%', left: '94%', size: 52 },
  { text: 'Ayllu', top: '52%', left: '58%', size: 76 },
  { text: 'Pacha', top: '12%', left: '18%', size: 60 },
  { text: 'Wasi', top: '74%', left: '58%', size: 48 },
  { text: 'Ñan', top: '92%', left: '90%', size: 64 },
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const sunRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const kusiY = useTransform(scrollYProgress, [0, 1], [0, 70])

  // Parallax GSAP ScrollTrigger sobre las capas de fondo (sol + palabras
  // quechua) para dar profundidad multi-capa. Import dinámico (regla #6):
  // GSAP solo se carga en el cliente, nunca en el bundle de SSR. Respeta
  // prefers-reduced-motion y limpia sus ScrollTriggers al desmontar.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: { revert: () => void } | undefined
    let cancelled = false

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // El sol dorado sube y se agranda un poco al hacer scroll (capa lejana).
        if (sunRef.current) {
          gsap.to(sunRef.current, {
            yPercent: -22,
            scale: 1.15,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.6 },
          })
        }
        // Las palabras quechua se desplazan hacia arriba (capa intermedia,
        // más rápida que el fondo → sensación de profundidad).
        if (wordsRef.current) {
          gsap.to(wordsRef.current, {
            yPercent: -14,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.6 },
          })
        }
      }, section)
    })()

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-kuska-cream pt-32 pb-20 sm:pt-40"
    >
      {/* Sol espiral dorado */}
      <div
        ref={sunRef}
        className="pointer-events-none absolute -right-32 -top-20 h-[420px] w-[420px] rounded-full opacity-[0.18] will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(212,146,10,0.9) 0%, rgba(212,146,10,0) 70%)',
        }}
        aria-hidden
      />

      {/* Frases quechua flotantes de fondo — 20 palabras, tamaños 48-130px.
          Envueltas en una capa propia para el parallax GSAP (ver useEffect). */}
      <div ref={wordsRef} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden>
        {floatingWords.map((w, i) => (
          <motion.span
            key={w.text}
            className="absolute font-display font-bold text-kuska-brown"
            style={{ top: w.top, left: w.left, fontSize: `${w.size}px`, opacity: 0.055 }}
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 6 + (i % 6),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {w.text}
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative mb-5 inline-block overflow-hidden rounded-full">
            <Badge variant="technique">
              🇵🇪 Primera plataforma artesanal del Perú
            </Badge>
            <span
              className="pointer-events-none absolute inset-0 animate-shimmer"
              style={{
                background:
                  'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.75) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
              }}
              aria-hidden
            />
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.02em] text-kuska-text">
            El arte que nace del{' '}
            <span className="text-kuska-red">alma andina</span>, conectado al
            mundo.
          </h1>
          <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-kuska-text-mid">
            Kuska une a las manos que tejen, moldean y crean con quienes valoran
            lo auténtico. Marketplace, comunidad, academia e inteligencia
            artificial al servicio del artesano peruano.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <RippleButton rounded="rounded-btn">
              <Link href="/registro/artesano">
                <Button variant="primary" size="lg">
                  Soy artesano
                </Button>
              </Link>
            </RippleButton>
            <RippleButton rounded="rounded-btn">
              <Link href="/marketplace">
                <Button variant="ghost" size="lg">
                  Explorar marketplace
                </Button>
              </Link>
            </RippleButton>
          </div>
        </motion.div>

        <motion.div className="flex justify-center" style={{ y: kusiY }}>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.55, duration: 1 }}
          >
            <Kusi
              size="xl"
              animation="float"
              priority
              message="¡Bienvenido a Kuska! ✨"
              messagePosition="top"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
