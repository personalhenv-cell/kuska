'use client'

import { useState } from 'react'
import type { Ally } from '@/lib/data/allies'

/**
 * Muestra el logo oficial del aliado desde /alianzas/<slug>.png.
 * Si el archivo aún no fue subido, renderiza un chip de respaldo con el
 * nombre sobre el color de marca (no reproduce el logotipo original).
 *
 * Usa <img> nativo a propósito: evita que el optimizador de next/image
 * falle ante un archivo local inexistente y permite el fallback con onError.
 */
export default function AllyLogo({
  ally,
  mode = 'card',
}: {
  ally: Ally
  mode?: 'card' | 'strip'
}) {
  const [failed, setFailed] = useState(false)
  const isStrip = mode === 'strip'

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl font-bold text-center leading-tight ${
          isStrip ? 'h-9 px-3 text-[11px]' : 'h-16 w-full px-4 text-sm'
        }`}
        style={{ background: ally.color, color: '#FFFFFF' }}
        title={ally.name}
      >
        {ally.name}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/alianzas/${ally.slug}.png`}
      alt={ally.name}
      onError={() => setFailed(true)}
      className={
        isStrip
          ? 'h-9 w-auto max-w-[130px] object-contain grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100'
          : 'h-16 w-auto max-w-[180px] object-contain'
      }
    />
  )
}
