'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { Input } from '@/components/ui/Input'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <p className="font-body text-sm text-kuska-text-mid">Preparando PDF…</p> },
)
const BusinessPlanPdfLazy = dynamic(
  () => import('@/components/pdf/BusinessPlanPdf').then((mod) => mod.BusinessPlanPdf),
  { ssr: false },
)

interface FormState {
  business_name: string
  category: string
  description: string
  target_market: string
  initial_budget: string
  region: string
}

const EMPTY: FormState = {
  business_name: '', category: '', description: '', target_market: '', initial_budget: '', region: '',
}
const INPUT_CLASS =
  'w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'

export function BusinessPlanGenerator() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string>()

  const set = (key: keyof FormState) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  async function generate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    setResult('')
    setSaved(false)
    try {
      const res = await fetch('/api/ai/business-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, initial_budget: Number(form.initial_budget) || 0 }),
      })
      if (!res.ok || !res.body) {
        const data: { error?: string } = await res.json().catch(() => ({}))
        setError(data.error ?? 'No se pudo generar el plan')
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

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/business-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.business_name || 'Mi plan de negocio', content: result }),
      })
      if (res.ok) setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={generate} className="space-y-4 rounded-card border border-kuska-border bg-white p-6">
        <Input label="Nombre del negocio" value={form.business_name} onChange={(e) => set('business_name')(e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Rubro" value={form.category} onChange={(e) => set('category')(e.target.value)} required />
          <Input label="Región" value={form.region} onChange={(e) => set('region')(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
            Descripción del negocio
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set('description')(e.target.value)}
            className={`${INPUT_CLASS} h-24 resize-none`}
            placeholder="¿Qué vendes o qué servicio ofreces?"
            required
          />
        </div>
        <Input label="Público objetivo" value={form.target_market} onChange={(e) => set('target_market')(e.target.value)} required />
        <Input
          label="Presupuesto inicial (S/)"
          type="number"
          value={form.initial_budget}
          onChange={(e) => set('initial_budget')(e.target.value)}
          required
        />
        <RippleButton className="block w-full">
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Generando…' : 'Generar plan de negocio'}
          </Button>
        </RippleButton>
        {error && <p className="font-body text-sm text-kuska-red">{error}</p>}
      </form>

      <div className="rounded-card border border-kuska-border bg-kuska-cream p-6">
        <h3 className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Tu plan</h3>
        {result ? (
          <>
            <p className="mt-3 whitespace-pre-line font-body leading-relaxed text-kuska-text">{result}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {!saved ? (
                <button
                  onClick={save}
                  disabled={saving || loading}
                  className="font-body text-sm font-semibold text-kuska-red hover:underline disabled:opacity-50"
                >
                  {saving ? 'Guardando…' : 'Guardar plan'}
                </button>
              ) : (
                <span className="font-body text-sm font-semibold text-kuska-teal">Plan guardado ✓</span>
              )}
              {!loading && (
                <PDFDownloadLink
                  document={<BusinessPlanPdfLazy title={form.business_name || 'Mi plan de negocio'} content={result} />}
                  fileName={`plan-negocio-${(form.business_name || 'kuska').toLowerCase().replace(/\s+/g, '-')}.pdf`}
                  className="font-body text-sm font-semibold text-kuska-brown hover:underline"
                >
                  Descargar PDF
                </PDFDownloadLink>
              )}
            </div>
          </>
        ) : (
          <p className="mt-3 font-body text-sm text-kuska-text-mid">
            Completa el formulario y presiona &ldquo;Generar plan de negocio&rdquo; para ver tu plan aquí.
          </p>
        )}
      </div>
    </div>
  )
}
