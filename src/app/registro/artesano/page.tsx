'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Kusi } from '@/components/ui/Kusi'
import { Logo } from '@/components/ui/Logo'
import { RippleButton } from '@/components/ui/RippleButton'
import { AuthBackground } from '@/components/auth/AuthBackground'

type Step = 1 | 2 | 3 | 4 | 5

const REGIONS = ['Cusco', 'Puno', 'Ayacucho', 'Junín', 'Lima', 'Arequipa', 'Amazonas', 'Piura', 'Loreto', 'Cajamarca', 'Huancavelica', 'Apurímac']
const TECHNIQUES = ['Telar de cintura', 'Telar de pedal', 'Modelado y bruñido', 'Retablo ayacuchano', 'Filigrana de plata', 'Tapicería', 'Tallado en madera', 'Bordado', 'Macramé', 'Repujado']
const SPECIALTIES = ['Textilería', 'Cerámica', 'Joyería', 'Retablos', 'Madera', 'Cuero', 'Gobelino', 'Pintura', 'Platería', 'Cestería']

interface FormData {
  name: string
  phone: string
  specialty: string
  technique: string
  region: string
  community: string
  years_experience: number
  story: string
  otp: string
}

const INPUT = 'w-full rounded-[12px] border border-white/20 bg-white/8 px-4 py-3 font-body text-kuska-cream placeholder:text-kuska-cream/35 focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'
const LABEL = 'block mb-1.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-cream/60'

function ProgressBar({ step }: { step: Step }) {
  const pct = ((step - 1) / 4) * 100
  return (
    <div className="mb-6">
      <div className="flex justify-between font-nunito text-xs text-kuska-cream/55 mb-1.5">
        <span>Paso {step} de 5</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #C84B2F, #D4920A)' }}
        />
      </div>
    </div>
  )
}

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
              ? 'border-kuska-gold bg-kuska-gold/20 text-kuska-gold font-semibold'
              : 'border-white/20 text-kuska-cream/65 hover:border-kuska-gold/50 hover:text-kuska-cream'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export default function RegistroArtesanoPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [devCode, setDevCode] = useState<string | null>(null)
  const [error, setError] = useState<string>()
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', specialty: '', technique: '',
    region: '', community: '', years_experience: 0, story: '', otp: '',
  })

  const set = (key: keyof FormData) => (value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  async function submit() {
    setLoading(true)
    setError(undefined)
    try {
      const res = await fetch('/api/registro/artesano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone, specialty: form.specialty,
          technique: form.technique, region: form.region, community: form.community,
          years_experience: form.years_experience, story: form.story,
        }),
      })
      const data: { ok?: boolean; devCode?: string; error?: string | object } = await res.json()
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Error al registrar. Verifica los datos.')
        return
      }
      setDevCode(data.devCode ?? null)
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    try {
      const result = await signIn('credentials', { phone: form.phone, otp: form.otp, redirect: false })
      if (result?.error) { setError('Código inválido o expirado'); return }
      setStep(4)
    } finally {
      setLoading(false)
    }
  }

  async function finish() {
    toast.success('¡Bienvenido a Kuska! 🦙')
    router.push('/dashboard')
  }

  const kusiMessages: Record<Step, { animation: 'wave' | 'think' | 'celebrate' | 'idle'; msg: string }> = {
    1: { animation: 'wave', msg: '¡Cuéntame de ti! 👋' },
    2: { animation: 'think', msg: 'Tu arte, tu especialidad ✨' },
    3: { animation: 'think', msg: 'Verifica tu número 🔐' },
    4: { animation: 'celebrate', msg: '¡Casi listo! 🎉' },
    5: { animation: 'celebrate', msg: '¡Ya eres parte de Kuska! 🦙' },
  }
  const { animation, msg } = kusiMessages[step]

  return (
    <AuthBackground>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[540px]"
      >
        <div
          className="rounded-[28px] px-8 py-8"
          style={{
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(52px) saturate(180%)',
            WebkitBackdropFilter: 'blur(52px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <Link href="/" className="flex items-center gap-2">
              <Logo size={28} />
              <span className="font-display text-base font-bold text-kuska-cream">Kuska</span>
            </Link>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Kusi size="sm" animation={animation} />
              </motion.div>
              <span className="hidden font-body text-xs text-kuska-cream/65 sm:block">{msg}</span>
            </div>
          </div>

          <ProgressBar step={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-kuska-cream">Datos personales</h1>
                    <p className="mt-1 font-body text-sm text-kuska-cream/65">Artesano · Paso 1 de 5</p>
                  </div>
                  <div>
                    <label className={LABEL}>Tu nombre completo</label>
                    <input
                      className={INPUT}
                      value={form.name}
                      onChange={(e) => set('name')(e.target.value)}
                      placeholder="Ana Quispe"
                      required
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Número de celular</label>
                    <input
                      className={INPUT}
                      type="tel"
                      inputMode="tel"
                      value={form.phone}
                      onChange={(e) => set('phone')(e.target.value)}
                      placeholder="999 888 777"
                      required
                    />
                  </div>
                  <RippleButton className="block w-full">
                    <Button size="lg" className="w-full" onClick={() => form.name && form.phone && setStep(2)}>
                      Continuar →
                    </Button>
                  </RippleButton>
                  <p className="text-center font-body text-sm text-kuska-cream/55">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="font-semibold text-kuska-gold hover:text-kuska-gold/80 transition-colors">
                      Ingresar
                    </Link>
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-kuska-cream">Tu arte</h1>
                    <p className="mt-1 font-body text-sm text-kuska-cream/65">Artesano · Paso 2 de 5</p>
                  </div>
                  <div>
                    <p className={LABEL}>Especialidad</p>
                    <SelectPill options={SPECIALTIES} value={form.specialty} onChange={set('specialty')} />
                  </div>
                  <div>
                    <p className={LABEL}>Técnica principal</p>
                    <SelectPill options={TECHNIQUES} value={form.technique} onChange={set('technique')} />
                  </div>
                  <div>
                    <p className={LABEL}>Región</p>
                    <SelectPill options={REGIONS} value={form.region} onChange={set('region')} />
                  </div>
                  <div>
                    <label className={LABEL}>Comunidad o ciudad</label>
                    <input
                      className={INPUT}
                      value={form.community}
                      onChange={(e) => set('community')(e.target.value)}
                      placeholder="Pisaq, Cusco"
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Años de experiencia</label>
                    <input
                      className={INPUT}
                      type="number"
                      value={String(form.years_experience)}
                      onChange={(e) => set('years_experience')(Number(e.target.value))}
                      placeholder="5"
                    />
                  </div>
                  {error && <p className="font-body text-xs text-red-400">{error}</p>}
                  <div className="flex gap-3">
                    <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>← Atrás</Button>
                    <RippleButton className="block flex-1">
                      <Button size="lg" className="w-full" onClick={submit} disabled={loading || !form.specialty || !form.region}>
                        {loading ? 'Creando…' : 'Crear cuenta'}
                      </Button>
                    </RippleButton>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={verifyOtp} className="space-y-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-kuska-cream">Verifica tu número</h1>
                    <p className="mt-1 font-body text-sm text-kuska-cream/65">Código enviado a {form.phone}</p>
                  </div>
                  {devCode && (
                    <div className="rounded-[16px] border border-kuska-gold/40 bg-kuska-gold/10 p-4 text-center">
                      <p className="font-nunito text-xs text-kuska-cream/60">Código OTP (modo demo)</p>
                      <p className="font-display text-3xl font-bold tracking-[0.3em] text-kuska-gold">{devCode}</p>
                    </div>
                  )}
                  <div>
                    <label className={LABEL}>Código de 6 dígitos</label>
                    <input
                      className={`${INPUT} text-center tracking-[0.4em] text-lg`}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={form.otp}
                      onChange={(e) => set('otp')(e.target.value)}
                      placeholder="000000"
                      required
                    />
                    {error && <p className="mt-1.5 font-body text-xs text-red-400">{error}</p>}
                  </div>
                  <RippleButton className="block w-full">
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Verificando…' : 'Verificar'}
                    </Button>
                  </RippleButton>
                </form>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-kuska-cream">Tu historia</h1>
                    <p className="mt-1 font-body text-sm text-kuska-cream/65">Opcional pero poderosa. ¿Cómo aprendiste?</p>
                  </div>
                  <textarea
                    className="h-28 w-full resize-none rounded-[12px] border border-white/20 bg-white/8 p-4 font-body text-kuska-cream placeholder:text-kuska-cream/35 focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all"
                    placeholder="Cuéntanos tu historia como artesano…"
                    value={form.story}
                    onChange={(e) => set('story')(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button variant="ghost" size="lg" className="flex-1" onClick={finish}>Omitir</Button>
                    <Button size="lg" className="flex-1" onClick={() => setStep(5)}>Continuar →</Button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-5 py-4 text-center">
                  <Kusi size="lg" animation="celebrate" message="¡Ya eres parte de Kuska! 🦙" />
                  <div>
                    <h1 className="font-display text-2xl font-bold text-kuska-cream">¡Bienvenido, artesano!</h1>
                    <p className="mt-2 font-body text-sm text-kuska-cream/65">Tu cuenta está lista. Ahora sube tu primera colección.</p>
                  </div>
                  <RippleButton className="block w-full">
                    <Button size="lg" className="w-full" onClick={finish}>Ir a mi panel →</Button>
                  </RippleButton>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AuthBackground>
  )
}
