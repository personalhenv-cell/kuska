'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

type KusiSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type KusiAnim = 'wave' | 'bounce' | 'celebrate' | 'think' | 'idle' | 'none'

const SIZES: Record<KusiSize, number> = { xs: 40, sm: 64, md: 96, lg: 140, xl: 200 }
const ANIM_CLASS: Record<KusiAnim, string> = {
  wave: 'kusi-wave',
  bounce: 'kusi-bounce',
  celebrate: 'kusi-celebrate',
  think: 'kusi-think',
  idle: 'kusi-idle',
  none: '',
}

interface KusiProps {
  size?: KusiSize
  animation?: KusiAnim
  /** Mensaje en burbuja junto a Kusi */
  message?: string
  /** Posición de la burbuja respecto a Kusi */
  bubbleSide?: 'right' | 'left' | 'top'
  className?: string
  priority?: boolean
}

export default function Kusi({
  size = 'md',
  animation = 'idle',
  message,
  bubbleSide = 'right',
  className = '',
  priority = false,
}: KusiProps) {
  const px = SIZES[size]
  const anim = ANIM_CLASS[animation]

  const mascot = (
    <div className={anim} style={{ width: px, height: px }}>
      <Image
        src="/kusi.png"
        alt="Kusi, la llama mascota de Kuska"
        width={px}
        height={px}
        priority={priority}
        className="object-contain drop-shadow-[0_8px_20px_rgba(61,28,2,0.18)] select-none pointer-events-none"
      />
    </div>
  )

  if (!message) return <div className={className}>{mascot}</div>

  const isRow = bubbleSide !== 'top'
  return (
    <div
      className={`flex ${isRow ? 'items-end' : 'flex-col items-center'} gap-3 ${
        bubbleSide === 'left' ? 'flex-row-reverse' : bubbleSide === 'top' ? 'flex-col-reverse' : 'flex-row'
      } ${className}`}
    >
      {mascot}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative liquid-glass rounded-2xl px-4 py-2.5 max-w-[240px]"
      >
        <p className="text-sm font-medium text-k-ink leading-snug font-round">{message}</p>
        {isRow && (
          <span
            className={`absolute bottom-3 ${bubbleSide === 'left' ? '-right-1.5' : '-left-1.5'} w-3 h-3 rotate-45 bg-[rgba(245,240,232,0.65)] border-l border-b border-[rgba(61,28,2,0.10)]`}
          />
        )}
      </motion.div>
    </div>
  )
}
