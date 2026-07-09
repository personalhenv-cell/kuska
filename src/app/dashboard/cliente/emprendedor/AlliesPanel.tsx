'use client'

import { useState } from 'react'

interface AlliesPanelProps {
  category: string
  region: string
  description: string
}

/** Tras generar el plan, permite pedirle a Kuska IA aliados reales sugeridos
 *  (artesanos verificados y otros emprendedores afines) consultando
 *  /api/ai/plan-aliados — que solo usa datos reales de la plataforma. */
export function AlliesPanel({ category, region, description }: AlliesPanelProps) {
  const [result, setResult] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  async function fetchAllies() {
    setLoading(true)
    setError(undefined)
    setResult(undefined)
    try {
      const res = await fetch('/api/ai/plan-aliados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, region, description }),
      })
      const text = await res.text()
      if (!res.ok) {
        const data: { error?: string } = JSON.parse(text || '{}')
        setError(data.error ?? 'No se pudieron sugerir aliados')
        return
      }
      setResult(text)
    } catch {
      setError('No se pudieron sugerir aliados')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-card border border-kuska-border bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-kuska-text">Aliados sugeridos por Kuska IA</h3>
          <p className="mt-1 font-body text-sm text-kuska-text-mid">
            Artesanos verificados y otros emprendedores de Kuska afines a tu negocio.
          </p>
        </div>
        <button
          onClick={fetchAllies}
          disabled={loading}
          className="rounded-btn bg-kuska-brown px-4 py-2.5 font-body text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? 'Buscando…' : result ? 'Buscar de nuevo' : 'Buscar aliados'}
        </button>
      </div>

      {loading && (
        <div className="mt-4 space-y-2">
          <div className="skeleton h-3 w-full rounded-full" />
          <div className="skeleton h-3 w-5/6 rounded-full" />
          <div className="skeleton h-3 w-3/4 rounded-full" />
        </div>
      )}

      {error && <p className="mt-4 font-body text-sm text-kuska-red">{error}</p>}

      {result && !loading && (
        <p className="mt-4 whitespace-pre-line border-t border-kuska-border pt-4 font-body text-sm leading-relaxed text-kuska-text">
          {result}
        </p>
      )}
    </div>
  )
}
