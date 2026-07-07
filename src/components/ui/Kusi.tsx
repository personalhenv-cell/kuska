'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

type KusiSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type KusiAnimation =
  | 'float'
  | 'wave'
  | 'bounce'
  | 'celebrate'
  | 'think'
  | 'idle'
  | 'sleep'

/** Expresiones ilustradas reales (no el sprite base con CSS) — para estados
 *  emocionales concretos: vacíos, errores, confirmaciones, onboarding. */
export type KusiExpression =
  | 'triste'
  | 'molesto'
  | 'explicando'
  | 'dudoso'
  | 'sorprendido'
  | 'asustado'

interface KusiProps {
  size?: KusiSize
  animation?: KusiAnimation
  /** Si se pasa, reemplaza /kusi.png por la ilustración de esa expresión. */
  expression?: KusiExpression
  message?: string
  messagePosition?: 'top' | 'bottom'
  className?: string
  priority?: boolean
}

const sizeMap: Record<KusiSize, number> = {
  xs: 28,
  sm: 52,
  md: 90,
  lg: 140,
  xl: 220,
}

const animationClass: Record<KusiAnimation, string> = {
  float: 'animate-kusi-float',
  wave: 'animate-kusi-wave',
  bounce: 'animate-kusi-bounce',
  celebrate: 'animate-kusi-celebrate',
  think: 'animate-kusi-think',
  idle: 'animate-kusi-idle',
  sleep: 'animate-kusi-sleep',
}

const expressionSrc: Record<KusiExpression, string> = {
  triste: '/kusi/kusi-triste.png',
  molesto: '/kusi/kusi-molesto.png',
  explicando: '/kusi/kusi-explicando.png',
  dudoso: '/kusi/kusi-dudoso.png',
  sorprendido: '/kusi/kusi-sorprendido.png',
  asustado: '/kusi/kusi-asustado.png',
}

function Bubble({ message }: { message: string }) {
  return (
    <div
      className="relative max-w-[220px] rounded-2xl border border-kuska-gold/30
                 bg-white px-4 py-2 text-center shadow-sm"
    >
      <p className="font-nunito text-sm text-kuska-text">{message}</p>
    </div>
  )
}

export function Kusi({
  size = 'md',
  animation = 'idle',
  expression,
  message,
  messagePosition = 'top',
  className,
  priority = false,
}: KusiProps) {
  const px = sizeMap[size]
  const src = expression ? expressionSrc[expression] : '/kusi.png'
  const alt = expression ? `Kusi, la mascota alpaca de Kuska, ${expression}` : 'Kusi, la mascota alpaca de Kuska'

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {message && messagePosition === 'top' && <Bubble message={message} />}
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        priority={priority}
        className={cn(
          'select-none object-contain drop-shadow-md',
          animationClass[animation],
        )}
      />
      {message && messagePosition === 'bottom' && <Bubble message={message} />}
    </div>
  )
}
