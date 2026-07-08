'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

interface RevealProps {
  children: ReactNode
  /** Retardo en segundos para escalonar entradas contiguas. */
  delay?: number
  /** Dirección desde la que entra el contenido. */
  from?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

const OFFSET = 28

/**
 * Envoltorio de scroll-reveal: el contenido entra con un fundido + desplazamiento
 * suave la primera vez que aparece en el viewport. Aporta el aire "premium" de
 * transiciones sin recargar cada sección con su propia lógica de animación.
 */
export function Reveal({ children, delay = 0, from = 'up', className }: RevealProps) {
  const initialOffset =
    from === 'up' ? { y: OFFSET } : from === 'down' ? { y: -OFFSET } : from === 'left' ? { x: OFFSET } : { x: -OFFSET }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
