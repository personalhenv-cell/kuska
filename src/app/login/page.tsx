'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Kusi } from '@/components/ui/Kusi'

type Step = 'phone' | 'otp'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data: { devCode?: string; error?: string } = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'No se pudo enviar el código')
        return
      }
      setDevCode(data.devCode ?? null)
      setStep('otp')
      toast.success('Código enviado')
    } finally {
      setLoading(false)
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        phone,
        otp,
        redirect: false,
      })
      if (result?.error) {
        setError('Código inválido o expirado')
        return
      }
      toast.success('¡Bienvenido a Kuska! 🦙')
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-kuska-cream lg:grid-cols-2">
      {/* Lado visual andino */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-12 text-kuska-cream lg:flex"
        style={{
          background:
            'linear-gradient(135deg, #3D1C02 0%, #2E7A6E 70%, #1a3a35 100%)',
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Kuska"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <span className="font-display text-2xl font-bold">Kuska</span>
        </Link>
        <svg
          className="absolute bottom-0 left-0 w-full opacity-40"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="rgba(212,146,10,0.3)"
            d="M0 240 L360 120 L720 220 L1080 110 L1440 210 L1440 320 L0 320 Z"
          />
        </svg>
        <div className="relative z-10 max-w-sm">
          <h2 className="font-display text-3xl font-bold leading-snug">
            Bienvenido de vuelta a la comunidad
          </h2>
          <p className="mt-3 font-body text-kuska-cream/75">
            Tu arte, tu historia y tu gente te esperan.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <Kusi size="md" animation={step === 'otp' ? 'think' : 'wave'} />
            <h1 className="font-display text-3xl font-bold text-kuska-text">
              Ingresar
            </h1>
            <p className="font-body text-sm text-kuska-text-mid">
              {step === 'phone'
                ? 'Te enviaremos un código a tu celular'
                : `Ingresa el código enviado a ${phone}`}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <Input
                label="Número de celular"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={error}
                required
              />
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar código'}
              </Button>
            </form>
          ) : (
            <form onSubmit={verify} className="space-y-4">
              {devCode && (
                <div className="liquid-glass-gold rounded-card p-4 text-center">
                  <p className="font-nunito text-xs text-kuska-text-mid">
                    Código (modo demo)
                  </p>
                  <p className="font-display text-3xl font-bold tracking-[0.3em] text-kuska-gold">
                    {devCode}
                  </p>
                </div>
              )}
              <Input
                label="Código de 6 dígitos"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={error}
                required
              />
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Ingresar'}
              </Button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full font-body text-sm text-kuska-text-mid hover:text-kuska-red"
              >
                Cambiar número
              </button>
            </form>
          )}

          <p className="mt-6 text-center font-body text-sm text-kuska-text-mid">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="font-semibold text-kuska-red">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
