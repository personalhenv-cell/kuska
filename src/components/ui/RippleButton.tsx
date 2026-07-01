'use client'

import { useState, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

interface RippleButtonProps {
  children: ReactNode
  className?: string
  /** Radio de esquina a usar para el glow y el clip del ripple — debe coincidir con el hijo. */
  rounded?: string
}

/** Envuelve un botón/link con glow rotando (hover) y efecto ripple (click), sin tocar su lógica interna. */
export function RippleButton({ children, className, rounded = 'rounded-btn' }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const id = Date.now()
    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
    ])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600)
  }

  return (
    <div className={cn('group relative inline-block', className)} onClickCapture={handleClick}>
      <div
        className={cn(
          'pointer-events-none absolute -inset-1 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70 animate-ripple-glow-spin',
          rounded,
        )}
        style={{ background: 'conic-gradient(from 0deg, #C84B2F, #D4920A, #2E7A6E, #C84B2F)' }}
        aria-hidden
      />
      <div className={cn('relative overflow-hidden', rounded)}>
        {children}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute animate-ripple-expand rounded-full bg-white/50"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}
