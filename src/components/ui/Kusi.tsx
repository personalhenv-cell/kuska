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

interface KusiProps {
  size?: KusiSize
  animation?: KusiAnimation
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
  message,
  messagePosition = 'top',
  className,
  priority = false,
}: KusiProps) {
  const px = sizeMap[size]

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {message && messagePosition === 'top' && <Bubble message={message} />}
      <Image
        src="/kusi.png"
        alt="Kusi, la mascota alpaca de Kuska"
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
