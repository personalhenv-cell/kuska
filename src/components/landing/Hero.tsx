'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const floatingWords = [
  { text: 'Kawsay', top: '12%', left: '8%' },
  { text: 'Munay', top: '24%', left: '78%' },
  { text: 'Away', top: '62%', left: '6%' },
  { text: 'Sumaq', top: '74%', left: '82%' },
  { text: 'Llaqta', top: '42%', left: '88%' },
  { text: 'Hatun', top: '82%', left: '40%' },
  { text: 'Sonqo', top: '16%', left: '46%' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-kuska-cream pt-32 pb-20 sm:pt-40">
      {/* Sol espiral dorado */}
      <div
        className="pointer-events-none absolute -right-32 -top-20 h-[420px] w-[420px] rounded-full opacity-[0.18]"
        style={{
          background:
            'radial-gradient(circle, rgba(212,146,10,0.9) 0%, rgba(212,146,10,0) 70%)',
        }}
        aria-hidden
      />

      {/* Frases quechua flotantes de fondo */}
      {floatingWords.map((w, i) => (
        <motion.span
          key={w.text}
          className="pointer-events-none absolute font-display text-4xl font-bold text-kuska-brown sm:text-6xl"
          style={{ top: w.top, left: w.left, opacity: 0.055 }}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          aria-hidden
        >
          {w.text}
        </motion.span>
      ))}

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.15fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Badge variant="technique" className="mb-5">
            🇵🇪 Primera plataforma artesanal del Perú
          </Badge>
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
            <Link href="/registro/artesano">
              <Button variant="primary" size="lg">
                Soy artesano
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="ghost" size="lg">
                Explorar marketplace
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex justify-center"
        >
          <Kusi
            size="xl"
            animation="float"
            priority
            message="¡Bienvenido a Kuska! ✨"
            messagePosition="top"
          />
        </motion.div>
      </div>
    </section>
  )
}
