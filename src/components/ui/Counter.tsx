'use client'

import { useEffect, useRef, useState } from 'react'

interface CounterProps {
  to: number
  suffix?: string
  prefix?: string
  durationMs?: number
}

/** Cuenta animada que arranca cuando entra en viewport. */
export function Counter({
  to,
  suffix = '',
  prefix = '',
  durationMs = 1800,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const p = Math.min(1, (now - start) / durationMs)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(to * eased))
            if (p < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, durationMs])

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('es-PE')}
      {suffix}
    </span>
  )
}
