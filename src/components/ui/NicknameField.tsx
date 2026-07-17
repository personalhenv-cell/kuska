'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { updateNickname } from '@/lib/actions/nickname'

export function NicknameField({ initialNickname }: { initialNickname: string | null }) {
  const { update } = useSession()
  const router = useRouter()
  const [value, setValue] = useState(initialNickname ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string>()

  async function save() {
    setSaving(true)
    setSaved(false)
    setError(undefined)
    try {
      const { nickname } = await updateNickname(value)
      // Refresca el JWT activo — sin esto el header/sidebar seguirían
      // mostrando el nombre real hasta el próximo login.
      await update({ nickname })
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el apodo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <label className="mb-1.5 block font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
        Apodo (opcional)
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={40}
          placeholder="Cómo quieres que te llamen en Kuska"
          className="min-w-0 flex-1 rounded-btn border border-kuska-border bg-white px-4 py-2.5 font-body text-sm text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
        />
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-btn border border-kuska-border bg-white px-4 py-2 font-body text-xs font-bold text-kuska-text transition-colors hover:border-kuska-gold disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
        {saved && <span className="font-body text-xs font-semibold text-kuska-teal">✓ Guardado</span>}
      </div>
      <p className="mt-1.5 font-body text-xs text-kuska-text-mid">
        Si lo dejas vacío, se muestra tu nombre real en la plataforma.
      </p>
      {error && <p className="mt-1 font-body text-xs text-kuska-red">{error}</p>}
    </div>
  )
}
