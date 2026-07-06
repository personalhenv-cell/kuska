'use client'

import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { joinFair } from './actions'

export function JoinFairButton({ fairId, alreadyJoined }: { fairId: string; alreadyJoined: boolean }) {
  const [joined, setJoined] = useState(alreadyJoined)
  const [isPending, startTransition] = useTransition()

  function join() {
    startTransition(async () => {
      try {
        await joinFair(fairId)
        setJoined(true)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'No se pudo unir a la feria')
      }
    })
  }

  if (joined) {
    return (
      <span className="inline-block rounded-btn bg-kuska-teal/15 px-4 py-2 font-body text-sm font-bold text-kuska-teal">
        Ya tienes tu stand ✓
      </span>
    )
  }

  return (
    <button
      onClick={join}
      disabled={isPending}
      className="rounded-btn bg-kuska-red px-4 py-2 font-body text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
    >
      {isPending ? 'Uniéndote…' : 'Unirme con mi stand'}
    </button>
  )
}
