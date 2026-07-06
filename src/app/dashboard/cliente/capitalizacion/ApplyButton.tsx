'use client'

import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { applyToFundAsEntrepreneur } from './actions'

export function ApplyButton({ opportunityId, alreadyApplied }: { opportunityId: string; alreadyApplied: boolean }) {
  const [applied, setApplied] = useState(alreadyApplied)
  const [isPending, startTransition] = useTransition()

  function apply() {
    startTransition(async () => {
      try {
        await applyToFundAsEntrepreneur(opportunityId)
        setApplied(true)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'No se pudo enviar la postulación')
      }
    })
  }

  if (applied) {
    return (
      <span className="inline-block rounded-btn bg-kuska-teal/15 px-4 py-2 font-body text-sm font-bold text-kuska-teal">
        Postulación enviada ✓
      </span>
    )
  }

  return (
    <button
      onClick={apply}
      disabled={isPending}
      className="rounded-btn bg-kuska-red px-4 py-2 font-body text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
    >
      {isPending ? 'Enviando…' : 'Postular'}
    </button>
  )
}
