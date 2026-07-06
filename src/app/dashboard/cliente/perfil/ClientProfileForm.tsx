'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { ClientProfile } from '@prisma/client'
import { Kusi } from '@/components/ui/Kusi'
import { updateClientProfile } from './actions'

const INTERESTS = ['Textiles', 'Cerámica', 'Joyería', 'Retablos', 'Madera', 'Arte contemporáneo']
const REGIONS = ['Cusco', 'Puno', 'Ayacucho', 'Junín', 'Lima', 'Arequipa', 'Amazonas']

function MultiSelectPill({
  options, value, onChange,
}: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) =>
    onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggle(o)}
          className={`rounded-full border px-3.5 py-1.5 font-body text-sm transition-all ${
            value.includes(o)
              ? 'border-kuska-red bg-kuska-red/10 font-semibold text-kuska-red'
              : 'border-kuska-border bg-white text-kuska-text-mid hover:border-kuska-red/40'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export function ClientProfileForm({ profile }: { profile: ClientProfile }) {
  const { update } = useSession()
  const router = useRouter()
  const [interests, setInterests] = useState<string[]>(profile.interests)
  const [regions, setRegions] = useState<string[]>(profile.regions_interest)
  const [isEntrepreneur, setIsEntrepreneur] = useState(profile.is_entrepreneur)
  const [businessName, setBusinessName] = useState(profile.business_name ?? '')
  const [newsletter, setNewsletter] = useState(profile.newsletter)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    setSaving(true)
    setSaved(false)
    try {
      await updateClientProfile({
        interests,
        regions_interest: regions,
        is_entrepreneur: isEntrepreneur,
        business_name: businessName || undefined,
        newsletter,
      })
      // Refresca el JWT de la sesión activa — sin esto, activar "emprendedor"
      // quedaría guardado en la DB pero invisible (sidebar, gates) hasta el
      // próximo login.
      await update({ is_entrepreneur: isEntrepreneur })
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5 rounded-card border border-kuska-border bg-white p-6">
      <div>
        <p className="mb-2.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
          ¿Qué tipo de arte te gusta?
        </p>
        <MultiSelectPill options={INTERESTS} value={interests} onChange={setInterests} />
      </div>

      <div>
        <p className="mb-2.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
          Regiones de tu interés
        </p>
        <MultiSelectPill options={REGIONS} value={regions} onChange={setRegions} />
      </div>

      <div className="rounded-2xl border border-kuska-border bg-kuska-cream/40 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-body font-semibold text-kuska-text">¿Eres emprendedor?</p>
            <p className="mt-0.5 font-body text-xs text-kuska-text-mid">
              IA para tu negocio, planes de inversión y acceso al Hub de Capitalización.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEntrepreneur((v) => !v)}
            aria-pressed={isEntrepreneur}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
              isEntrepreneur ? 'bg-kuska-teal' : 'bg-kuska-border'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform ${
                isEntrepreneur ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <AnimatePresence>
          {isEntrepreneur && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-center gap-3">
                <Kusi size="xs" expression="explicando" />
                <p className="font-nunito text-xs text-kuska-text-mid">
                  Cuéntanos el nombre de tu negocio (opcional) para tu plan de negocio con IA.
                </p>
              </div>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Nombre de tu emprendimiento"
                className="mt-2 w-full rounded-btn border border-kuska-border bg-white px-4 py-2.5 font-body text-sm text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-kuska-border bg-kuska-cream/40 p-4">
        <div>
          <p className="font-body font-semibold text-kuska-text">Recibir novedades por correo</p>
          <p className="mt-0.5 font-body text-xs text-kuska-text-mid">Nuevos artesanos, ferias y talleres.</p>
        </div>
        <button
          type="button"
          onClick={() => setNewsletter((v) => !v)}
          aria-pressed={newsletter}
          className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
            newsletter ? 'bg-kuska-teal' : 'bg-kuska-border'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform ${
              newsletter ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          onClick={save}
          disabled={saving}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-btn bg-kuska-red px-6 py-3 font-body text-sm font-bold text-white shadow-md transition-shadow hover:shadow-lg disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </motion.button>
        <AnimatePresence>
          {saved && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="font-body text-sm font-semibold text-kuska-teal"
            >
              ✓ Perfil actualizado
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
