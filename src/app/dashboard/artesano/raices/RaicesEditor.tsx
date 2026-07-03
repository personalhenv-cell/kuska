'use client'

import { useState } from 'react'
import Image from 'next/image'
import { upload } from '@vercel/blob/client'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { updateRaices } from './actions'

interface RaicesData {
  story: string
  story_audio_url: string
  genealogy: string
  workshop_photos: string[]
}

const INPUT_CLASS =
  'w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'

export function RaicesEditor({ initial }: { initial: RaicesData }) {
  const { data: authSession } = useSession()
  const [data, setData] = useState<RaicesData>(initial)
  const [saving, setSaving] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [uploadingAudio, setUploadingAudio] = useState(false)
  const [error, setError] = useState<string>()

  async function onPhotosSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 12 - data.workshop_photos.length)
    if (files.length === 0 || !authSession?.user.id) return
    setUploadingPhotos(true)
    setError(undefined)
    try {
      const urls: string[] = []
      for (const file of files) {
        const blob = await upload(`raices/${authSession.user.id}/${Date.now()}-${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        })
        urls.push(blob.url)
      }
      setData((prev) => ({ ...prev, workshop_photos: [...prev.workshop_photos, ...urls] }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron subir las fotos')
    } finally {
      setUploadingPhotos(false)
    }
  }

  async function onAudioSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !authSession?.user.id) return
    setUploadingAudio(true)
    setError(undefined)
    try {
      const blob = await upload(`raices/${authSession.user.id}/${Date.now()}-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      setData((prev) => ({ ...prev, story_audio_url: blob.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir el audio')
    } finally {
      setUploadingAudio(false)
    }
  }

  function removePhoto(url: string) {
    setData((prev) => ({ ...prev, workshop_photos: prev.workshop_photos.filter((p) => p !== url) }))
  }

  async function save() {
    setSaving(true)
    setError(undefined)
    try {
      await updateRaices(data)
      toast.success('Tu módulo Raíces se actualizó ✓')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6 rounded-card border border-kuska-border bg-white p-6">
      <div>
        <label className="mb-1.5 block font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
          Tu historia completa
        </label>
        <textarea
          value={data.story}
          onChange={(e) => setData((prev) => ({ ...prev, story: e.target.value }))}
          className={`${INPUT_CLASS} h-40 resize-none`}
          placeholder="¿Cómo aprendiste tu oficio? ¿Qué significa para ti y tu comunidad?"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
          Árbol genealógico / legado familiar
        </label>
        <textarea
          value={data.genealogy}
          onChange={(e) => setData((prev) => ({ ...prev, genealogy: e.target.value }))}
          className={`${INPUT_CLASS} h-24 resize-none`}
          placeholder="Ej: Aprendí de mi abuela Rosa, quien a su vez aprendió de su madre en Chinchero…"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
          Audio de tu historia (opcional)
        </label>
        <input type="file" accept="audio/*" onChange={onAudioSelected} disabled={uploadingAudio} className="font-body text-sm" />
        {uploadingAudio && <p className="mt-1 font-body text-xs text-kuska-text-mid">Subiendo audio…</p>}
        {data.story_audio_url && (
          <audio controls src={data.story_audio_url} className="mt-2 w-full" />
        )}
      </div>

      <div>
        <label className="mb-1.5 block font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
          Galería del taller (hasta 12 fotos)
        </label>
        <input type="file" accept="image/*" multiple onChange={onPhotosSelected} disabled={uploadingPhotos} className="font-body text-sm" />
        {uploadingPhotos && <p className="mt-1 font-body text-xs text-kuska-text-mid">Subiendo fotos…</p>}
        {data.workshop_photos.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {data.workshop_photos.map((url) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-btn border border-kuska-border">
                <Image src={url} alt="Foto del taller" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-kuska-red text-xs text-white group-hover:flex"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="font-body text-sm text-kuska-red">{error}</p>}

      <RippleButton className="block w-full">
        <Button size="lg" className="w-full" onClick={save} disabled={saving || uploadingPhotos || uploadingAudio}>
          {saving ? 'Guardando…' : 'Guardar módulo Raíces'}
        </Button>
      </RippleButton>
    </div>
  )
}
