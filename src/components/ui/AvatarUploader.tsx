'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { upload } from '@vercel/blob/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { updateAvatarUrl } from '@/lib/actions/avatar'
import { compressImage } from '@/lib/image-compress'

const MAX_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

const ACCENT_TEXT = { teal: 'text-kuska-teal', red: 'text-kuska-red' } as const
const ACCENT_BG = { teal: 'bg-kuska-teal/15', red: 'bg-kuska-red/15' } as const

/**
 * Foto de perfil real — sube a Vercel Blob (carpeta `avatars/<userId>/`, ver
 * /api/upload) y guarda la URL en `users.avatar_url` con updateAvatarUrl.
 * Se usa en el perfil de cliente y de artesano; ambos comparten el mismo
 * campo en la DB, así que el cambio se ve de inmediato en header, tarjetas,
 * reseñas y comentarios en toda la plataforma.
 */
export function AvatarUploader({
  userId,
  name,
  initialUrl,
  accent = 'red',
}: {
  userId: string
  name: string
  initialUrl: string | null
  accent?: 'red' | 'teal'
}) {
  const { update } = useSession()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(initialUrl)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>()

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const original = e.target.files?.[0]
    e.target.value = ''
    if (!original) return
    setError(undefined)

    if (!ACCEPTED_TYPES.includes(original.type)) {
      setError('Formato no permitido. Usa JPG, PNG, WEBP o AVIF.')
      return
    }

    const localPreview = URL.createObjectURL(original)
    setPreview(localPreview)
    setUploading(true)
    setProgress(0)
    // Comprime antes de subir — una foto de cámara sin comprimir (3-8 MB)
    // puede tardar minutos con mala señal; comprimida sube en segundos.
    const file = await compressImage(original, 800, 0.85)
    if (file.size > MAX_SIZE) {
      setError('La imagen es muy grande incluso comprimida. Intenta con otra foto.')
      setUploading(false)
      setPreview(initialUrl)
      URL.revokeObjectURL(localPreview)
      return
    }
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 90000)
    try {
      const blob = await upload(`avatars/${userId}/${Date.now()}-${sanitizedFilename}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        abortSignal: controller.signal,
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      })
      clearTimeout(timeoutId)
      await updateAvatarUrl(blob.url)
      // Refresca el JWT activo — sin esto el header/sidebar seguirían
      // mostrando la foto vieja hasta el próximo login.
      await update({ image: blob.url })
      setPreview(blob.url)
      router.refresh()
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : ''
      const isAbort = /abort/i.test(rawMsg)
      setError(
        isAbort
          ? 'La subida tardó demasiado (> 90s) incluso comprimida. Revisa tu conexión e intenta de nuevo.'
          : rawMsg || 'No se pudo subir la foto. Intenta de nuevo.',
      )
      setPreview(initialUrl)
    } finally {
      clearTimeout(timeoutId)
      setUploading(false)
      setProgress(0)
      URL.revokeObjectURL(localPreview)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Cambiar foto de perfil"
        className="group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-kuska-border"
      >
        {uploading ? (
          // Skeleton — nunca spinner genérico.
          <div className="h-full w-full animate-pulse bg-kuska-border/70" aria-hidden />
        ) : preview ? (
          <Image
            src={preview}
            alt={name}
            fill
            unoptimized={preview.startsWith('blob:')}
            className="object-cover"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${ACCENT_BG[accent]}`}>
            <span className={`font-display text-2xl font-bold ${ACCENT_TEXT[accent]}`}>
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-kuska-brown/0 font-nunito text-[10px] font-bold uppercase tracking-wide text-white opacity-0 transition-all group-hover:bg-kuska-brown/50 group-hover:opacity-100">
          Cambiar
        </span>
      </button>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-btn border border-kuska-border bg-white px-4 py-2 font-body text-xs font-bold text-kuska-text transition-colors hover:border-kuska-gold disabled:opacity-60"
        >
          {uploading ? `Subiendo… ${progress}%` : 'Cambiar foto'}
        </button>
        <p className="mt-1.5 font-body text-xs text-kuska-text-mid">JPG, PNG o WEBP. Máx. 5 MB.</p>
        {error && <p className="mt-1 font-body text-xs text-kuska-red">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={onFileSelected}
        className="hidden"
      />
    </div>
  )
}
