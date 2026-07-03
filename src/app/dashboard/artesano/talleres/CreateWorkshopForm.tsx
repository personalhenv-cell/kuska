'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function CreateWorkshopForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    capacity: 10,
    price: 0,
    is_virtual: true,
    materials_url: '',
  })

  const set = <K extends keyof typeof form>(k: K) => (v: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/talleres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          capacity: Number(form.capacity),
          price: Number(form.price),
          date: new Date(form.date).toISOString(),
          materials_url: form.materials_url || undefined,
        }),
      })
      if (res.ok) {
        setOpen(false)
        setForm({ title: '', description: '', date: '', capacity: 10, price: 0, is_virtual: true, materials_url: '' })
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(typeof data.error === 'string' ? data.error : 'Revisa los campos e intenta de nuevo')
      }
    } catch {
      setError('Error de red. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button size="md" onClick={() => setOpen(true)}>
        + Crear taller
      </Button>
    )
  }

  const valid = form.title.length >= 4 && form.description.length >= 10 && form.date && Number(form.capacity) >= 1

  return (
    <div className="rounded-card border border-kuska-border bg-white p-6">
      <h2 className="font-display text-lg font-bold text-kuska-text">Nuevo taller</h2>
      <div className="mt-4 grid gap-4">
        <Input
          label="Título"
          value={form.title}
          onChange={(e) => set('title')(e.target.value)}
          placeholder="Introducción al telar de cintura"
        />
        <div>
          <label className="mb-1.5 block font-body text-sm font-medium text-kuska-text">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description')(e.target.value)}
            rows={4}
            className="w-full rounded-input border border-kuska-border bg-white px-4 py-2.5 font-body text-kuska-text outline-none focus:border-kuska-red"
            placeholder="Qué aprenderán, materiales, nivel…"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Fecha y hora"
            type="datetime-local"
            value={form.date}
            onChange={(e) => set('date')(e.target.value)}
          />
          <Input
            label="Cupos"
            type="number"
            min={1}
            value={String(form.capacity)}
            onChange={(e) => set('capacity')(Number(e.target.value))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Precio (S/) — 0 = gratis"
            type="number"
            min={0}
            value={String(form.price)}
            onChange={(e) => set('price')(Number(e.target.value))}
          />
          <div>
            <label className="mb-1.5 block font-body text-sm font-medium text-kuska-text">Modalidad</label>
            <div className="flex gap-2">
              {[
                { v: true, label: '🌐 Virtual' },
                { v: false, label: '📍 Presencial' },
              ].map((o) => (
                <button
                  key={String(o.v)}
                  type="button"
                  onClick={() => set('is_virtual')(o.v)}
                  className={`flex-1 rounded-input border px-3 py-2.5 font-body text-sm transition-colors ${
                    form.is_virtual === o.v
                      ? 'border-kuska-red bg-kuska-red/10 font-semibold text-kuska-red'
                      : 'border-kuska-border bg-white text-kuska-text-mid'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Input
          label="Enlace de materiales (opcional)"
          value={form.materials_url}
          onChange={(e) => set('materials_url')(e.target.value)}
          placeholder="https://…"
        />

        {error && <p className="font-body text-sm text-kuska-red">{error}</p>}

        <div className="flex gap-3">
          <Button size="md" onClick={submit} disabled={loading || !valid}>
            {loading ? 'Creando…' : 'Publicar taller'}
          </Button>
          <Button size="md" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
