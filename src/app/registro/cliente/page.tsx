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

function MultiSelectPill({
  options, value, onChange,
}: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) =>
    onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => toggle(o)}
          className={`rounded-full border px-3 py-1.5 font-body text-sm transition-all ${
            value.includes(o)
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

  return (
    <main className="min-h-screen bg-kuska-cream">
      <div className="grid min-h-screen lg:grid-cols-[380px_1fr]">
        <div
          className="hidden flex-col justify-between p-10 text-kuska-cream lg:flex"
          style={{ background: 'linear-gradient(160deg, #2E7A6E 0%, #3D1C02 100%)' }}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Kuska" width={40} height={40} className="h-10 w-10 object-contain" />
            <span className="font-display text-2xl font-bold">Kuska</span>
          </Link>
          <Kusi size="xl" animation={step === 4 ? 'celebrate' : 'wave'} message={step === 4 ? '¡Bienvenido! 🦙' : '¡Explora arte único! 🎨'} />
          <div>
            <p className="font-display text-xl font-bold">Conecta con el arte peruano</p>
            <p className="mt-1 font-body text-sm text-kuska-cream/75">Cada compra apoya a una familia artesana.</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-lg space-y-6">
            {step === 1 && (
              <div className="space-y-5">
                <Badge variant="region">Paso 1 de 4</Badge>
                <h1 className="font-display text-3xl font-bold text-kuska-text">Datos personales</h1>
                <Input label="Tu nombre" value={form.name} onChange={(e) => set('name')(e.target.value)} required />
                <Input label="Número de celular" inputMode="tel" value={form.phone} onChange={(e) => set('phone')(e.target.value)} required />
                <Button size="lg" className="w-full" onClick={() => form.name && form.phone && setStep(2)}>Continuar</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <Badge variant="region">Paso 2 de 4</Badge>
                <h1 className="font-display text-3xl font-bold text-kuska-text">Tus intereses</h1>
                <div>
                  <p className="mb-2 font-nunito text-sm font-bold text-kuska-text-mid">¿Qué tipo de arte te gusta?</p>
                  <MultiSelectPill options={INTERESTS} value={form.interests} onChange={set('interests')} />
                </div>
                <div>
                  <p className="mb-2 font-nunito text-sm font-bold text-kuska-text-mid">¿Qué regiones te interesan?</p>
                  <MultiSelectPill options={REGIONS} value={form.regions_interest} onChange={set('regions_interest')} />
                </div>

                <div className="rounded-card border border-kuska-border bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-body font-semibold text-kuska-text">¿Eres emprendedor?</p>
                      <p className="font-body text-sm text-kuska-text-mid">Activa herramientas extra: IA para tu negocio, planes de inversión y más.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => set('is_entrepreneur')(!form.is_entrepreneur)}
                      className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${form.is_entrepreneur ? 'bg-kuska-teal' : 'bg-kuska-cream-dark'}`}
                      aria-pressed={form.is_entrepreneur}
                    >
                      <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform ${form.is_entrepreneur ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  {form.is_entrepreneur && (
                    <Kusi size="sm" animation="celebrate" message="¡Genial! Activando herramientas IA 🚀" className="mt-3" />
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>Atrás</Button>
                  <Button size="lg" className="flex-1" onClick={register} disabled={loading}>
                    {loading ? 'Creando…' : 'Crear cuenta'}
                  </Button>
                </div>
                {error && <p className="font-body text-sm text-kuska-red" role="alert">{error}</p>}
              </div>
            )}

            {step === 3 && (
              <form onSubmit={verifyOtp} className="space-y-5">
                <Badge variant="region">Paso 3 de 4</Badge>
                <h1 className="font-display text-3xl font-bold text-kuska-text">Verifica tu número</h1>
                {devCode && (
                  <div className="liquid-glass-gold rounded-card p-4 text-center">
                    <p className="font-nunito text-xs text-kuska-text-mid">Código OTP (modo demo)</p>
                    <p className="font-display text-3xl font-bold tracking-[0.3em] text-kuska-gold">{devCode}</p>
                  </div>
                )}
                <Input label="Código de 6 dígitos" inputMode="numeric" maxLength={6} value={form.otp} onChange={(e) => set('otp')(e.target.value)} error={error} required />
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Verificando…' : 'Verificar y entrar'}
                </Button>
              </form>
            )}

            {step === 4 && (
              <div className="space-y-6 text-center">
                <Kusi size="lg" animation="celebrate" message="¡Bienvenido a Kuska! 🦙" />
                <h1 className="font-display text-3xl font-bold text-kuska-text">¡Todo listo!</h1>
                <p className="font-body text-kuska-text-mid">Tu cuenta está activa. Empieza a descubrir arte peruano único.</p>
                <Button size="lg" className="mx-auto" onClick={() => { toast.success('¡Bienvenido! 🦙'); router.push('/marketplace') }}>
                  Explorar marketplace
                </Button>
              </div>
            )}

            {step < 3 && (
              <p className="text-center font-body text-sm text-kuska-text-mid">
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
