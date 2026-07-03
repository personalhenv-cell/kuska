'use client'

import { useState, useTransition } from 'react'
import { toggleFundActive } from './actions'

export function ActiveToggle({ fundId, isActive }: { fundId: string; isActive: boolean }) {
  const [active, setActive] = useState(isActive)
  const [isPending, startTransition] = useTransition()

  function toggle() {
    const next = !active
    setActive(next)
    startTransition(async () => {
      await toggleFundActive(fundId, next)
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`rounded-full px-3 py-1 font-nunito text-xs font-bold uppercase tracking-wide transition-colors disabled:opacity-50 ${
        active ? 'bg-kuska-teal/15 text-kuska-teal hover:bg-kuska-red/15 hover:text-kuska-red' : 'bg-kuska-red/15 text-kuska-red hover:bg-kuska-teal/15 hover:text-kuska-teal'
      }`}
    >
      {active ? 'Activa' : 'Inactiva'}
    </button>
  )
}
