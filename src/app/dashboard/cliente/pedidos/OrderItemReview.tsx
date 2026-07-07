'use client'

import { useState } from 'react'
import { ReviewForm } from './ReviewForm'

export function OrderItemReview({ productId, productName }: { productId: string; productName: string }) {
  const [open, setOpen] = useState(false)

  if (open) {
    return <ReviewForm productId={productId} productName={productName} onDone={() => setOpen(false)} />
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="mt-1 font-body text-xs font-semibold text-kuska-gold transition-colors hover:text-kuska-red"
    >
      ★ Dejar reseña
    </button>
  )
}
