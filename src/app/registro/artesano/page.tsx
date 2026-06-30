'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Kusi } from '@/components/ui/Kusi'

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

function ProgressBar({ step }: { step: Step }) {
  const pct = ((step - 1) / 4) * 100
  return (
    <div className="mb-8">
      <div className="flex justify-between font-nunito text-xs text-kuska-text-mid mb-2">
        <span>Paso {step} de 5</span>
        <span>{Math.round(pct)}% completado</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-kuska-cream-dark">
        <div
          className="h-full rounded-full bg-kuska-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function SelectPill({
  options, value, onChange,
}: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full border px-3 py-1.5 font-body text-sm transition-all ${
            value === o
              ? 'border-kuska-gold bg-kuska-gold text-kuska-brown font-semibold'
              : 'border-kuska-border bg-white text-kuska-text-mid hover:border-kuska-gold'
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
  const [userId, setUserId] = useState<string | null>(null)
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
      const data: { ok?: boolean; userId?: string; devCode?: string; error?: string | object } = await res.json()
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Error al registrar. Verifica los datos.')
        return
      }
      setUserId(data.userId ?? null)
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
    <main className="min-h-screen bg-kuska-cream">
      <div className="grid min-h-screen lg:grid-cols-[380px_1fr]">
        {/* Panel lateral */}
        <div
          className="hidden flex-col justify-between p-10 text-kuska-cream lg:flex"
          style={{ background: 'linear-gradient(160deg, #3D1C02 0%, #2E7A6E 100%)' }}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Kuska" width={40} height={40} className="h-10 w-10 object-contain" />
            <span className="font-display text-2xl font-bold">Kuska</span>
          </Link>
          <div className="space-y-4">
            <Kusi size="xl" animation={animation} message={msg} />
          </div>
          <div>
            <p className="font-display text-xl font-bold">Únete a más de 1,200 artesanos</p>
            <p className="mt-1 font-body text-sm text-kuska-cream/75">Gratis para empezar. Sin comisiones el primer mes.</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-lg">
            <ProgressBar step={step} />

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <Badge variant="technique">Paso 1</Badge>
                  <h1 className="mt-2 font-display text-3xl font-bold text-kuska-text">Datos personales</h1>
                </div>
                <Input label="Tu nombre completo" value={form.name} onChange={(e) => set('name')(e.target.value)} required />
                <Input label="Número de celular" inputMode="tel" value={form.phone} onChange={(e) => set('phone')(e.target.value)} required />
                <Button size="lg" className="w-full" onClick={() => form.name && form.phone && setStep(2)}>
                  Continuar
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <Badge variant="technique">Paso 2</Badge>
                  <h1 className="mt-2 font-display text-3xl font-bold text-kuska-text">Tu arte</h1>
                </div>
                <div>
                  <p className="mb-2 font-nunito text-sm font-bold text-kuska-text-mid">Especialidad</p>
                  <SelectPill options={SPECIALTIES} value={form.specialty} onChange={set('specialty')} />
                </div>
                <div>
                  <p className="mb-2 font-nunito text-sm font-bold text-kuska-text-mid">Técnica principal</p>
                  <SelectPill options={TECHNIQUES} value={form.technique} onChange={set('technique')} />
                </div>
                <div>
                  <p className="mb-2 font-nunito text-sm font-bold text-kuska-text-mid">Región</p>
                  <SelectPill options={REGIONS} value={form.region} onChange={set('region')} />
                </div>
                <Input label="Comunidad o ciudad" value={form.community} onChange={(e) => set('community')(e.target.value)} />
                <Input label="Años de experiencia" type="number" value={String(form.years_experience)} onChange={(e) => set('years_experience')(Number(e.target.value))} />
                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>Atrás</Button>
                  <Button size="lg" className="flex-1" onClick={submit} disabled={loading || !form.specialty || !form.region}>
                    {loading ? 'Creando cuenta…' : 'Crear cuenta'}
                  </Button>
                </div>
                {error && <p className="font-body text-sm text-kuska-red" role="alert">{error}</p>}
              </div>
            )}

            {step === 3 && (
              <form onSubmit={verifyOtp} className="space-y-5">
                <div>
                  <Badge variant="technique">Paso 3</Badge>
                  <h1 className="mt-2 font-display text-3xl font-bold text-kuska-text">Verifica tu número</h1>
                </div>
                {devCode && (
                  <div className="liquid-glass-gold rounded-card p-4 text-center">
                    <p className="font-nunito text-xs text-kuska-text-mid">Código OTP (modo demo)</p>
                    <p className="font-display text-3xl font-bold tracking-[0.3em] text-kuska-gold">{devCode}</p>
                  </div>
                )}
                <Input label="Código de 6 dígitos" inputMode="numeric" maxLength={6} value={form.otp} onChange={(e) => set('otp')(e.target.value)} error={error} required />
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Verificando…' : 'Verificar'}
                </Button>
              </form>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <Badge variant="technique">Paso 4</Badge>
                  <h1 className="mt-2 font-display text-3xl font-bold text-kuska-text">Tu historia</h1>
                  <p className="mt-1 font-body text-kuska-text-mid">Opcional pero poderosa. ¿Cómo aprendiste tu arte?</p>
                </div>
                <textarea
                  className="h-32 w-full rounded-btn border border-kuska-border bg-white p-4 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
                  placeholder="Cuéntanos tu historia como artesano…"
                  value={form.story}
                  onChange={(e) => set('story')(e.target.value)}
                />
                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" className="flex-1" onClick={finish}>Omitir</Button>
                  <Button size="lg" className="flex-1" onClick={() => setStep(5)}>Continuar</Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 text-center">
                <Kusi size="lg" animation="celebrate" message="¡Ya eres parte de Kuska! 🦙" />
                <h1 className="font-display text-3xl font-bold text-kuska-text">¡Bienvenido, artesano!</h1>
                <p className="font-body text-kuska-text-mid">Tu cuenta está lista. Ahora sube tu primera colección.</p>
                <Button size="lg" className="mx-auto" onClick={finish}>Ir a mi panel</Button>
              </div>
            )}

            {step < 3 && (
              <p className="mt-6 text-center font-body text-sm text-kuska-text-mid">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="font-semibold text-kuska-red">Ingresar</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
