'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { upload } from '@vercel/blob/client'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} estrellas`}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`h-7 w-7 ${n <= value ? 'text-kuska-gold' : 'text-kuska-cream-dark'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export function ReviewForm({ productId, productName, onDone }: { productId: string; productName: string; onDone: () => void }) {
  const router = useRouter()
  const { data: authSession } = useSession()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function submit() {
    if (comment.trim().length < 5) {
      toast.error('Cuenta un poco más sobre tu experiencia (mínimo 5 caracteres)')
      return
    }
    if (!authSession?.user.id) return

    setSubmitting(true)
    try {
      let image_url: string | undefined
      if (file) {
        const blob = await upload(`reviews/${authSession.user.id}/${Date.now()}-${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        })
        image_url = blob.url
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, rating, comment, image_url }),
      })
      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}))
        toast.error(data.error ?? 'No se pudo publicar la reseña')
        return
      }
      toast.success('¡Gracias por tu reseña! 🦙')
      router.refresh()
      onDone()
    } catch {
      toast.error('Error de red. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-3 rounded-card border border-kuska-gold/30 bg-kuska-gold/5 p-4">
      <p className="font-body text-sm font-semibold text-kuska-text">Reseña — {productName}</p>
      <div className="mt-2">
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="¿Qué te pareció la pieza?"
        maxLength={500}
        className="mt-3 h-20 w-full resize-none rounded-btn border border-kuska-border bg-white px-3 py-2 font-body text-sm text-kuska-text focus:border-kuska-gold focus:outline-none"
      />

      <div className="mt-3 flex items-center gap-3">
        <label className="flex cursor-pointer items-center gap-1.5 rounded-btn border border-kuska-border bg-white px-3 py-2 font-body text-xs font-semibold text-kuska-text-mid transition-colors hover:border-kuska-gold hover:text-kuska-gold">
          <Icon name="box" className="h-4 w-4" />
          {file ? 'Cambiar foto' : 'Agregar foto (opcional)'}
          <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
        </label>
        {preview && (
          <div className="relative h-12 w-12 overflow-hidden rounded-btn border border-kuska-border">
            <Image src={preview} alt="Vista previa de la foto de la reseña" fill className="object-cover" />
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={submit} disabled={submitting}>
          {submitting ? 'Publicando…' : 'Publicar reseña'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onDone} disabled={submitting}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
