'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { Input } from '@/components/ui/Input'

interface FormState {
  name: string
  category: string
  technique: string
  region: string
  materials: string
  notes: string
}

const EMPTY: FormState = { name: '', category: '', technique: '', region: '', materials: '', notes: '' }
const INPUT_CLASS =
  'w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'

export function DescriptionGenerator() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [copied, setCopied] = useState(false)

  const set = (key: keyof FormState) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  async function generate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    setResult('')
    setCopied(false)
    try {
      const res = await fetch('/api/ai/product-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok || !res.body) {
        const data: { error?: string } = await res.json().catch(() => ({}))
        setError(data.error ?? 'No se pudo generar la descripción')
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

  function copy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={generate} className="space-y-4 rounded-card border border-kuska-border bg-white p-6">
        <Input label="Nombre del producto" value={form.name} onChange={(e) => set('name')(e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Categoría" value={form.category} onChange={(e) => set('category')(e.target.value)} required />
          <Input label="Técnica" value={form.technique} onChange={(e) => set('technique')(e.target.value)} required />
        </div>
        <Input label="Región" value={form.region} onChange={(e) => set('region')(e.target.value)} required />
        <Input label="Materiales (opcional)" value={form.materials} onChange={(e) => set('materials')(e.target.value)} />
        <div>
          <label className="mb-1.5 block font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
            Notas para la IA (opcional)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes')(e.target.value)}
            className={`${INPUT_CLASS} h-24 resize-none`}
            placeholder="Ej: pieza única, tardó 3 semanas en tejerse…"
          />
        </div>
        <RippleButton className="block w-full">
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Generando…' : 'Generar descripción'}
          </Button>
        </RippleButton>
        {error && <p className="font-body text-sm text-kuska-red">{error}</p>}
      </form>

      <div className="rounded-card border border-kuska-border bg-kuska-cream p-6">
        <h3 className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Resultado</h3>
        {result ? (
          <>
            <p className="mt-3 whitespace-pre-line font-body leading-relaxed text-kuska-text">{result}</p>
            <button
              onClick={copy}
              className="mt-4 font-body text-sm font-semibold text-kuska-red hover:underline"
            >
              {copied ? '¡Copiado! ✓' : 'Copiar texto'}
            </button>
          </>
        ) : (
          <p className="mt-3 font-body text-sm text-kuska-text-mid">
            Completa el formulario y presiona &ldquo;Generar descripción&rdquo; para ver el resultado aquí.
          </p>
        )}
      </div>
    </div>
  )
}
