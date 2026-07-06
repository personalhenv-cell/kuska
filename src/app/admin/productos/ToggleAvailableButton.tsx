'use client'

import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { toggleProductAvailable } from './actions'

export function ToggleAvailableButton({ productId, isAvailable }: { productId: string; isAvailable: boolean }) {
  const [available, setAvailable] = useState(isAvailable)
  const [isPending, startTransition] = useTransition()

  function toggle() {
    const next = !available
    setAvailable(next)
    startTransition(async () => {
      try {
        await toggleProductAvailable(productId, next)
      } catch (e) {
        setAvailable(!next)
        toast.error(e instanceof Error ? e.message : 'No se pudo actualizar el estado')
      }
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`rounded-full px-3 py-1 font-nunito text-xs font-bold uppercase tracking-wide transition-colors disabled:opacity-50 ${
        available ? 'bg-kuska-teal/15 text-kuska-teal hover:bg-kuska-red/15 hover:text-kuska-red' : 'bg-kuska-red/15 text-kuska-red hover:bg-kuska-teal/15 hover:text-kuska-teal'
      }`}
    >
      {available ? 'Publicado' : 'Oculto'}
    </button>
  )
}
