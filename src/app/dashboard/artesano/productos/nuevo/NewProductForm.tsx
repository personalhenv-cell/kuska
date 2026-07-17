'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { upload } from '@vercel/blob/client'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { Input } from '@/components/ui/Input'
import { compressImage } from '@/lib/image-compress'

const SPECIALTIES = ['Textilería', 'Cerámica', 'Joyería', 'Retablos', 'Madera', 'Cuero', 'Gobelino', 'Pintura', 'Platería', 'Cestería']
const TECHNIQUES = ['Telar de cintura', 'Telar de pedal', 'Modelado y bruñido', 'Retablo ayacuchano', 'Filigrana de plata', 'Tapicería', 'Tallado en madera', 'Bordado', 'Macramé', 'Repujado']
const REGIONS = ['Cusco', 'Puno', 'Ayacucho', 'Junín', 'Lima', 'Arequipa', 'Amazonas', 'Piura', 'Loreto', 'Cajamarca', 'Huancavelica', 'Apurímac']

interface FormState {
  name: string
  description: string
  price: string
  stock: string
  category: string
  technique: string
  region: string
  materials: string
}

const EMPTY: FormState = { name: '', description: '', price: '', stock: '1', category: '', technique: '', region: '', materials: '' }
const INPUT_CLASS =
  'w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'

function SelectPill({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full border px-3 py-1 font-body text-xs transition-all ${
            value === o
              ? 'border-kuska-gold bg-kuska-gold/15 text-[#9a6a07] font-semibold'
              : 'border-kuska-border text-kuska-text-mid hover:border-kuska-gold/50'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export function NewProductForm() {
  const router = useRouter()
  const { data: authSession } = useSession()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [error, setError] = useState<string>()

  const set = (key: keyof FormState) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []).slice(0, 8)
    setFiles(selected)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)

    if (files.length === 0) {
      setError('Sube al menos una foto de tu producto')
      return
    }
    if (!form.category || !form.technique || !form.region) {
      setError('Completa categoría, técnica y región')
      return
    }
    if (!authSession?.user.id) {
      setError('Sesión inválida, vuelve a iniciar sesión')
      return
    }

    setUploading(true)
    try {
      const images: string[] = []
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Comprimiendo foto ${i + 1} de ${files.length}…`)
        const file = await compressImage(files[i])
        try {
          // Sanitizar nombre de archivo para evitar caracteres problemáticos
          const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
          const path = `products/${authSession.user.id}/${Date.now()}-${sanitizedFilename}`
          setUploadProgress(`Subiendo foto ${i + 1} de ${files.length}… 0%`)

          // AbortController real: si tarda más de 90s, se cancela la petición
          // en curso (no solo se abandona la promesa) y se muestra un error claro.
          // 90s (no 45s) porque ahora el % de progreso es real — una conexión
          // lenta pero viva no debe cortarse antes de tiempo, solo una que
          // de verdad se congeló.
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 90000)

          const blob = await upload(path, file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
            abortSignal: controller.signal,
            onUploadProgress: ({ percentage }) => {
              setUploadProgress(`Subiendo foto ${i + 1} de ${files.length}… ${percentage}%`)
            },
          })
          clearTimeout(timeoutId)
          images.push(blob.url)
        } catch (uploadErr) {
          const rawMsg = uploadErr instanceof Error ? uploadErr.message : ''
          const isAbort = uploadErr instanceof Error && /abort/i.test(rawMsg)
          const errorMsg = isAbort
            ? 'La subida tardó demasiado (> 90s) incluso comprimida. Revisa tu conexión a internet e intenta de nuevo.'
            : rawMsg || 'Error desconocido al subir foto'
          setError(`Error subiendo foto ${i + 1}: ${errorMsg}`)
          console.error(`Upload error for file ${i}:`, uploadErr)
          return
        }
      }

      setUploadProgress('Creando producto…')
      const price = Number(form.price)
      const stock = Number(form.stock)

      if (!price || price <= 0) {
        setError('El precio debe ser mayor a 0')
        return
      }
      if (stock < 0) {
        setError('El stock no puede ser negativo')
        return
      }

      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price,
          stock,
          materials: form.materials.split(',').map((m) => m.trim()).filter(Boolean),
          images,
        }),
      })
      if (!res.ok) {
        const data: { error?: string | object } = await res.json().catch(() => ({}))
        const errorMsg = typeof data.error === 'string' ? data.error :
                        (data.error && typeof data.error === 'object' && 'message' in data.error) ?
                        (data.error as any).message :
                        'No se pudo crear el producto'
        setError(errorMsg)
        console.error('Error creating product:', data)
        return
      }
      router.push('/dashboard/artesano/productos')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo subir la foto. Intenta de nuevo.')
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5 rounded-card border border-kuska-border bg-white p-6">
      <Input label="Nombre del producto" value={form.name} onChange={(e) => set('name')(e.target.value)} required />

      <div>
        <label className="mb-1.5 block font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
          Descripción
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set('description')(e.target.value)}
          className={`${INPUT_CLASS} h-28 resize-none`}
          placeholder="Cuenta la historia de esta pieza…"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Precio (S/)" type="number" value={form.price} onChange={(e) => set('price')(e.target.value)} required />
        <Input label="Stock" type="number" value={form.stock} onChange={(e) => set('stock')(e.target.value)} required />
      </div>

      <div>
        <p className="mb-1.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Categoría</p>
        <SelectPill options={SPECIALTIES} value={form.category} onChange={set('category')} />
      </div>
      <div>
        <p className="mb-1.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Técnica</p>
        <SelectPill options={TECHNIQUES} value={form.technique} onChange={set('technique')} />
      </div>
      <div>
        <p className="mb-1.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Región</p>
        <SelectPill options={REGIONS} value={form.region} onChange={set('region')} />
      </div>

      <Input
        label="Materiales (separados por coma)"
        value={form.materials}
        onChange={(e) => set('materials')(e.target.value)}
        placeholder="Lana de alpaca, tinte natural"
      />

      <div>
        <label className="mb-1.5 block font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
          Fotos (hasta 8)
        </label>
        <input type="file" accept="image/*" multiple onChange={onFilesSelected} className="font-body text-sm" />
        {files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className="relative h-16 w-16 overflow-hidden rounded-btn border border-kuska-border">
                <Image src={URL.createObjectURL(f)} alt={f.name} fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="font-body text-sm text-kuska-red">{error}</p>}

      <RippleButton className="block w-full">
        <Button type="submit" size="lg" className="w-full" disabled={uploading}>
          {uploading ? uploadProgress || 'Publicando…' : 'Publicar producto'}
        </Button>
      </RippleButton>
    </form>
  )
}
