'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { Input } from '@/components/ui/Input'
import { AlliesPanel } from './AlliesPanel'
import { SavedPlansPanel } from './SavedPlansPanel'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <p className="font-body text-sm text-kuska-text-mid">Preparando PDF…</p> },
)
const BusinessPlanPdfLazy = dynamic(
  () => import('@/components/pdf/BusinessPlanPdf').then((mod) => mod.BusinessPlanPdf),
  { ssr: false },
)

type Step = 1 | 2 | 3 | 4

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

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: 'Datos del negocio' },
  { id: 2, label: 'Generar con IA' },
  { id: 3, label: 'Revisar y guardar' },
  { id: 4, label: 'Mis planes' },
]

const STEP_TRANSITION = { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const }

export function BusinessPlanGenerator() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string>()

  const set = (key: keyof FormState) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const formComplete = Object.values(form).every((v) => v.trim().length > 0)
  const canGoTo = (target: Step) => {
    if (target === 1 || target === 4) return true
    if (target === 2) return formComplete
    if (target === 3) return result.length > 0
    return false
  }

  async function generate() {
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
      setStep(3)
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
      if (res.ok) {
        setSaved(true)
        toast.success('Plan guardado ✓')
      } else {
        toast.error('No se pudo guardar el plan')
      }
    } catch {
      toast.error('No se pudo guardar el plan')
    } finally {
      setSaving(false)
    }
  }

  function resetToNewPlan() {
    setForm(EMPTY)
    setResult('')
    setSaved(false)
    setError(undefined)
    setStep(1)
  }

  return (
    <div className="space-y-6">
      {/* Indicador de pasos */}
      <div className="flex flex-wrap gap-2">
        {STEPS.map((s) => {
          const enabled = canGoTo(s.id)
          const active = step === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => enabled && setStep(s.id)}
              disabled={!enabled}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 font-body text-xs font-semibold transition-all ${
                active
                  ? 'border-kuska-red bg-kuska-red/10 text-kuska-red'
                  : enabled
                    ? 'border-kuska-border bg-white text-kuska-text-mid hover:border-kuska-gold/50'
                    : 'cursor-not-allowed border-kuska-border/50 bg-white/50 text-kuska-text-mid/40'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  active ? 'bg-kuska-red text-white' : 'bg-kuska-cream-dark text-kuska-text-mid'
                }`}
              >
                {s.id}
              </span>
              {s.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={STEP_TRANSITION}
        >
          {step === 1 && (
            <div className="space-y-4 rounded-card border border-kuska-border bg-white p-6">
              <h3 className="font-display text-lg font-bold text-kuska-text">Paso 1 · Cuéntanos tu negocio</h3>
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
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  disabled={!formComplete}
                  onClick={() => setStep(2)}
                >
                  Continuar →
                </Button>
              </RippleButton>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 rounded-card border border-kuska-border bg-white p-6">
              <h3 className="font-display text-lg font-bold text-kuska-text">Paso 2 · Genera tu plan con Kuska IA</h3>
              <div className="rounded-btn bg-kuska-cream p-4">
                <p className="font-body text-sm text-kuska-text-mid">
                  <strong className="text-kuska-text">{form.business_name}</strong> · {form.category} · {form.region}
                </p>
                <p className="mt-1 font-body text-sm text-kuska-text-mid">{form.description}</p>
              </div>

              {loading ? (
                <div className="space-y-2 rounded-btn border border-kuska-border p-4">
                  <div className="skeleton h-3 w-full rounded-full" />
                  <div className="skeleton h-3 w-5/6 rounded-full" />
                  <div className="skeleton h-3 w-4/6 rounded-full" />
                  <div className="skeleton h-3 w-3/6 rounded-full" />
                  <p className="pt-1 font-body text-xs text-kuska-text-mid">Kuska IA está redactando tu plan…</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost" size="lg" onClick={() => setStep(1)}>
                    ← Editar datos
                  </Button>
                  <RippleButton className="block flex-1">
                    <Button size="lg" className="w-full" onClick={generate}>
                      Generar plan de negocio
                    </Button>
                  </RippleButton>
                </div>
              )}
              {error && <p className="font-body text-sm text-kuska-red">{error}</p>}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-card border border-kuska-border bg-kuska-cream p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
                    Paso 3 · Revisa y edita tu plan
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                    ← Volver a generar
                  </Button>
                </div>
                {result ? (
                  <>
                    <textarea
                      value={result}
                      onChange={(e) => { setResult(e.target.value); setSaved(false) }}
                      className="mt-4 h-72 w-full resize-y rounded-btn border border-kuska-border bg-white p-4 font-body text-sm leading-relaxed text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
                    />
                    <p className="mt-2 font-body text-xs text-kuska-text-mid">
                      Puedes editar el texto antes de guardarlo — es tuyo, ajústalo como necesites.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {!saved ? (
                        <button
                          onClick={save}
                          disabled={saving}
                          className="font-body text-sm font-semibold text-kuska-red hover:underline disabled:opacity-50"
                        >
                          {saving ? 'Guardando…' : 'Guardar plan'}
                        </button>
                      ) : (
                        <span className="font-body text-sm font-semibold text-kuska-teal">Plan guardado ✓</span>
                      )}
                      <PDFDownloadLink
                        document={<BusinessPlanPdfLazy title={form.business_name || 'Mi plan de negocio'} content={result} />}
                        fileName={`plan-negocio-${(form.business_name || 'kuska').toLowerCase().replace(/\s+/g, '-')}.pdf`}
                        className="font-body text-sm font-semibold text-kuska-brown hover:underline"
                      >
                        Descargar PDF
                      </PDFDownloadLink>
                      <button
                        onClick={resetToNewPlan}
                        className="font-body text-sm font-semibold text-kuska-text-mid hover:underline"
                      >
                        Empezar un plan nuevo
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="mt-3 font-body text-sm text-kuska-text-mid">
                    Todavía no generaste un plan. Vuelve al Paso 2.
                  </p>
                )}
              </div>

              {result && (
                <AlliesPanel category={form.category} region={form.region} description={form.description} />
              )}
            </div>
          )}

          {step === 4 && <SavedPlansPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
