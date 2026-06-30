'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Kusi } from '@/components/ui/Kusi'
import { AuthBackground } from '@/components/auth/AuthBackground'

type Step = 1 | 2 | 3 | 4

const INTERESTS = ['Textiles', 'Cerámica', 'Joyería', 'Retablos', 'Madera', 'Arte contemporáneo']
const REGIONS = ['Cusco', 'Puno', 'Ayacucho', 'Junín', 'Lima', 'Arequipa', 'Amazonas']

interface FormData {
  name: string
  phone: string
  interests: string[]
  regions_interest: string[]
  is_entrepreneur: boolean
  otp: string
}

const INPUT = 'w-full rounded-[12px] border border-white/20 bg-white/8 px-4 py-3 font-body text-kuska-cream placeholder:text-kuska-cream/35 focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'
const LABEL = 'block mb-1.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-cream/60'

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
          className={`rounded-full border px-3 py-1 font-body text-xs transition-all ${
            value.includes(o)
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

export default function RegistroClientePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [devCode, setDevCode] = useState<string | null>(null)
  const [error, setError] = useState<string>()
  const [form, setForm] = useState<FormData>({
    name: '', phone: '', interests: [], regions_interest: [],
    is_entrepreneur: false, otp: '',
  })

  const set = <K extends keyof FormData>(key: K) => (value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  async function register() {
    setLoading(true)
    setError(undefined)
    try {
      const res = await fetch('/api/registro/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data: { ok?: boolean; devCode?: string; error?: string | object } = await res.json()
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Error al registrar')
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

  const kusiAnim = step === 4 ? 'celebrate' : step === 1 ? 'wave' : 'idle'
  const kusiMsg = step === 4 ? '¡Bienvenido! 🦙' : step === 1 ? '¡Explora arte único! 🎨' : 'Casi listo ✨'

  return (
    <AuthBackground>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[480px]"
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
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Kuska" width={28} height={28} className="h-7 w-7 object-contain" />
              <span className="font-display text-base font-bold text-kuska-cream">Kuska</span>
            </Link>
            <div className="flex items-center gap-2">
              <Kusi size="sm" animation={kusiAnim as 'wave' | 'idle' | 'celebrate'} />
              <span className="hidden font-body text-xs text-kuska-cream/65 sm:block">{kusiMsg}</span>
            </div>
          </div>

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
                    <p className="mt-1 font-body text-sm text-kuska-cream/65">Cliente · Paso 1 de 4</p>
                  </div>
                  <div>
                    <label className={LABEL}>Tu nombre</label>
                    <input
                      className={INPUT}
                      value={form.name}
                      onChange={(e) => set('name')(e.target.value)}
                      placeholder="María García"
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
                  <Button size="lg" className="w-full" onClick={() => form.name && form.phone && setStep(2)}>
                    Continuar →
                  </Button>
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
                    <h1 className="font-display text-2xl font-bold text-kuska-cream">Tus intereses</h1>
                    <p className="mt-1 font-body text-sm text-kuska-cream/65">Cliente · Paso 2 de 4</p>
                  </div>
                  <div>
                    <p className={LABEL}>¿Qué tipo de arte te gusta?</p>
                    <MultiSelectPill options={INTERESTS} value={form.interests} onChange={set('interests')} />
                  </div>
                  <div>
                    <p className={LABEL}>¿Qué regiones te interesan?</p>
                    <MultiSelectPill options={REGIONS} value={form.regions_interest} onChange={set('regions_interest')} />
                  </div>

                  <div
                    className="rounded-[16px] p-4"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.14)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-body font-semibold text-kuska-cream">¿Eres emprendedor?</p>
                        <p className="font-body text-xs text-kuska-cream/55 mt-0.5">IA para tu negocio, planes de inversión y más.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => set('is_entrepreneur')(!form.is_entrepreneur)}
                        className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${form.is_entrepreneur ? 'bg-kuska-teal' : 'bg-white/20'}`}
                        aria-pressed={form.is_entrepreneur}
                      >
                        <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform ${form.is_entrepreneur ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    {form.is_entrepreneur && (
                      <div className="mt-3">
                        <Kusi size="sm" animation="celebrate" message="¡Genial! Activando herramientas IA 🚀" />
                      </div>
                    )}
                  </div>

                  {error && <p className="font-body text-xs text-red-400">{error}</p>}
                  <div className="flex gap-3">
                    <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>← Atrás</Button>
                    <Button size="lg" className="flex-1" onClick={register} disabled={loading}>
                      {loading ? 'Creando…' : 'Crear cuenta'}
                    </Button>
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
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Verificando…' : 'Verificar y entrar'}
                  </Button>
                </form>
              )}

              {step === 4 && (
                <div className="space-y-5 py-4 text-center">
                  <Kusi size="lg" animation="celebrate" message="¡Bienvenido a Kuska! 🦙" />
                  <div>
                    <h1 className="font-display text-2xl font-bold text-kuska-cream">¡Todo listo!</h1>
                    <p className="mt-2 font-body text-sm text-kuska-cream/65">Tu cuenta está activa. Empieza a descubrir arte peruano único.</p>
                  </div>
                  <Button size="lg" className="w-full" onClick={() => { toast.success('¡Bienvenido! 🦙'); router.push('/marketplace') }}>
                    Explorar marketplace →
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AuthBackground>
  )
}
