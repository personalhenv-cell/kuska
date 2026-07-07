'use client'

import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { createFair } from './actions'

const INPUT_CLASS =
  'w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'

export function NewFairForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [saving, setSaving] = useState(false)

  async function action(formData: FormData) {
    setSaving(true)
    try {
      await createFair(formData)
      formRef.current?.reset()
      toast.success('Feria creada')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo crear la feria')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-card border border-kuska-border bg-white p-6">
      <h2 className="font-display text-lg font-bold text-kuska-text">Nueva feria digital</h2>
      <input name="title" placeholder="Título de la feria" required className={INPUT_CLASS} />
      <input name="theme" placeholder="Tema (ej: Navidad andina)" required className={INPUT_CLASS} />
      <textarea name="description" placeholder="Descripción" required className={`${INPUT_CLASS} h-20 resize-none`} />
      <div className="grid grid-cols-2 gap-4">
        <input name="start_date" type="date" required className={INPUT_CLASS} />
        <input name="end_date" type="date" required className={INPUT_CLASS} />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? 'Creando…' : 'Crear feria'}
      </Button>
    </form>
  )
}
