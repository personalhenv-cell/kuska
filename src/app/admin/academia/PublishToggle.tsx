'use client'

import { useState, useTransition } from 'react'
import { togglePublished } from './actions'

export function PublishToggle({ postId, isPublished }: { postId: string; isPublished: boolean }) {
  const [published, setPublished] = useState(isPublished)
  const [isPending, startTransition] = useTransition()

  function toggle() {
    const next = !published
    setPublished(next)
    startTransition(async () => {
      await togglePublished(postId, next)
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`rounded-full px-3 py-1 font-nunito text-xs font-bold uppercase tracking-wide transition-colors disabled:opacity-50 ${
        published ? 'bg-kuska-teal/15 text-kuska-teal hover:bg-kuska-red/15 hover:text-kuska-red' : 'bg-kuska-red/15 text-kuska-red hover:bg-kuska-teal/15 hover:text-kuska-teal'
      }`}
    >
      {published ? 'Publicado' : 'Borrador'}
    </button>
  )
}
