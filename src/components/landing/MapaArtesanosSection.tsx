'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import type { MapRegion } from './ArtisanMap'

// Leaflet toca `window` — carga dinámica sin SSR (regla de oro #6).
const ArtisanMap = dynamic(() => import('./ArtisanMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-3xl bg-kuska-brown/10" />
  ),
})

export function MapaArtesanosSection() {
  const [regions, setRegions] = useState<MapRegion[] | null>(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let alive = true
    fetch('/api/artesanos/mapa')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { regions: MapRegion[]; total: number }) => {
        if (!alive) return
        setRegions(data.regions)
        setTotal(data.total)
      })
      .catch(() => alive && setRegions([]))
    return () => {
      alive = false
    }
  }, [])

  const regionCount = useMemo(() => regions?.length ?? 0, [regions])

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-10 text-center"
      >
        <span className="mb-4 inline-block rounded-full bg-kuska-teal/10 px-4 py-1.5 text-sm font-semibold text-kuska-teal">
          Talento de todo el Perú
        </span>
        <h2 className="font-serif text-3xl font-bold text-kuska-brown md:text-4xl">
          Artesanos en cada rincón del país
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-kuska-brown/70">
          {total > 0 ? (
            <>
              <span className="font-bold text-kuska-red">{total}</span> maestros artesanos en{' '}
              <span className="font-bold text-kuska-red">{regionCount}</span>{' '}
              {regionCount === 1 ? 'región' : 'regiones'}. Toca un punto para conocerlos.
            </>
          ) : (
            'Explora el mapa y descubre a los maestros artesanos detrás de cada pieza.'
          )}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative h-[480px] w-full overflow-hidden rounded-3xl border border-kuska-brown/15 shadow-xl md:h-[560px]"
      >
        {regions === null ? (
          <div className="h-full w-full animate-pulse bg-kuska-brown/10" />
        ) : (
          <ArtisanMap regions={regions} />
        )}
      </motion.div>
    </section>
  )
}
