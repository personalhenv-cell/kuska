'use client'

import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Card con efecto 3D tilt siguiendo el mouse (desactivado en touch). */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`
  }

  function reset() {
    const el = ref.current
    if (el) el.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn(
        'transition-transform duration-300 ease-out will-change-transform',
        className,
      )}
    >
      {children}
    </div>
  )
}
