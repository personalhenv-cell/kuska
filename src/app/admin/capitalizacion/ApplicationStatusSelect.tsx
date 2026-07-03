'use client'

import { useState, useTransition } from 'react'
import { updateApplicationStatus } from './actions'

const STATUSES = ['en_revision', 'aprobado', 'rechazado']

export function ApplicationStatusSelect({ applicationId, status }: { applicationId: string; status: string }) {
  const [value, setValue] = useState(status)
  const [isPending, startTransition] = useTransition()

  function onChange(next: string) {
    setValue(next)
    startTransition(async () => {
      await updateApplicationStatus(applicationId, next)
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
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}
