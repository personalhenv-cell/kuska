'use client'

import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { createFund } from './actions'

const INPUT_CLASS =
  'w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'

export function NewFundForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [saving, setSaving] = useState(false)

  async function action(formData: FormData) {
    setSaving(true)
    try {
      await createFund(formData)
      formRef.current?.reset()
      toast.success('Convocatoria creada')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo crear la convocatoria')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-card border border-kuska-border bg-white p-6">
      <h2 className="font-display text-lg font-bold text-kuska-text">Nueva convocatoria</h2>
      <input name="title" placeholder="Título del fondo" required className={INPUT_CLASS} />
      <div className="grid grid-cols-2 gap-4">
        <input name="institution" placeholder="Institución" required className={INPUT_CLASS} />
        <input name="amount" type="number" placeholder="Monto (S/)" required className={INPUT_CLASS} />
      </div>
      <input name="deadline" type="date" required className={INPUT_CLASS} />
      <input name="requirements" placeholder="Requisitos separados por coma" className={INPUT_CLASS} />
      <input name="link" type="url" placeholder="Enlace externo (opcional)" className={INPUT_CLASS} />
      <Button type="submit" disabled={saving}>
        {saving ? 'Creando…' : 'Crear convocatoria'}
      </Button>
    </form>
  )
}
