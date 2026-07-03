'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { Kusi } from '@/components/ui/Kusi'

export function MatchFinder() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  async function findMatches() {
    setLoading(true)
    setError(undefined)
    setResult('')
    try {
      const res = await fetch('/api/ai/match-emprendedores', { method: 'POST' })
      if (!res.ok || !res.body) {
        const data: { error?: string } = await res.json().catch(() => ({}))
        setError(data.error ?? 'No se pudo buscar matches')
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setResult(acc)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-card border border-kuska-border bg-white p-6">
      {!result && !loading && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <Kusi size="lg" animation="think" message="¿Buscamos con quién colaborar?" />
          <RippleButton>
            <Button size="lg" onClick={findMatches}>Buscar matches con IA</Button>
          </RippleButton>
        </div>
      )}
      {loading && !result && (
        <p className="py-10 text-center font-body text-sm text-kuska-text-mid">Buscando matches reales…</p>
      )}
      {result && (
        <>
          <p className="whitespace-pre-line font-body leading-relaxed text-kuska-text">{result}</p>
          {!loading && (
            <RippleButton className="mt-6 inline-block">
              <Button variant="ghost" onClick={findMatches}>Buscar de nuevo</Button>
            </RippleButton>
          )}
        </>
      )}
      {error && <p className="mt-4 font-body text-sm text-kuska-red">{error}</p>}
    </div>
  )
}
