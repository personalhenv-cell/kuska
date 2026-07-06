'use client'

import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { updateApplicationStatus } from './actions'

const STATUSES: { value: string; label: string }[] = [
  { value: 'en_revision', label: 'En revisión' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'rechazado', label: 'Rechazado' },
]

export function ApplicationStatusSelect({ applicationId, status }: { applicationId: string; status: string }) {
  const [value, setValue] = useState(status)
  const [isPending, startTransition] = useTransition()

  function onChange(next: string) {
    const prev = value
    setValue(next)
    startTransition(async () => {
      try {
        await updateApplicationStatus(applicationId, next)
      } catch (e) {
        setValue(prev)
        toast.error(e instanceof Error ? e.message : 'No se pudo actualizar el estado')
      }
    })
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isPending}
      className="rounded-btn border border-kuska-border px-2 py-1 font-body text-xs disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}
