'use client'

import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { toggleUserActive } from './actions'

export function ToggleActiveButton({ userId, isActive }: { userId: string; isActive: boolean }) {
  const [active, setActive] = useState(isActive)
  const [isPending, startTransition] = useTransition()

  function toggle() {
    const next = !active
    setActive(next)
    startTransition(async () => {
      try {
        await toggleUserActive(userId, next)
      } catch (e) {
        setActive(!next)
        toast.error(e instanceof Error ? e.message : 'No se pudo actualizar el estado')
      }
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
      {active ? 'Activo' : 'Suspendido'}
    </button>
  )
}
