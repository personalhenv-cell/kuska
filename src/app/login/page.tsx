'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Kusi } from '@/components/ui/Kusi'
import { Logo } from '@/components/ui/Logo'
import { RippleButton } from '@/components/ui/RippleButton'
import { AuthBackground } from '@/components/auth/AuthBackground'
import { AuthCard } from '@/components/auth/AuthCard'

type Step = 'phone' | 'otp'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [kusiAnim, setKusiAnim] = useState<'bounce' | 'idle'>('bounce')

  useEffect(() => {
    const t = setTimeout(() => setKusiAnim('idle'), 900)
    return () => clearTimeout(t)
  }, [])

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
      const result = await signIn('credentials', { phone, otp, redirect: false })
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

  const dir = step === 'otp' ? 1 : -1

  return (
    <AuthBackground>
      <AuthCard>
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-display text-lg font-bold text-kuska-cream">Kuska</span>
          </Link>
        </div>

        {/* Kusi bounce → idle, con pulse continuo */}
        <motion.div
          className="flex justify-center mb-4"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Kusi size="sm" animation={kusiAnim} />
        </motion.div>

        {/* Step slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -dir * 40 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {step === 'phone' ? (
              <div className="space-y-5">
                <div className="text-center">
                  <h1 className="font-display text-2xl font-bold text-kuska-cream">Ingresar</h1>
                  <p className="mt-1 font-body text-sm text-kuska-cream/65">
                    Te enviamos un código a tu celular
                  </p>
                </div>
                <form onSubmit={sendOtp} className="space-y-4">
                  <div>
                    <label className="block mb-1.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-cream/60">
                      Número de celular
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="999 888 777"
                      required
                      className="w-full rounded-btn border border-white/30 bg-white px-4 py-3 font-body text-kuska-text placeholder:text-kuska-text-mid/50 focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all"
                    />
                    {error && (
                      <p className="mt-1.5 font-body text-xs text-red-400">{error}</p>
                    )}
                  </div>
                  <RippleButton className="block w-full">
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Enviando…' : 'Enviar código'}
                    </Button>
                  </RippleButton>
                </form>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="text-center">
                  <h1 className="font-display text-2xl font-bold text-kuska-cream">Verifica tu número</h1>
                  <p className="mt-1 font-body text-sm text-kuska-cream/65">Código enviado a {phone}</p>
                </div>
                {devCode && (
                  <div className="rounded-card border border-kuska-gold/40 bg-kuska-gold/10 p-4 text-center">
                    <p className="font-nunito text-xs text-kuska-cream/60">Código OTP (modo demo)</p>
                    <p className="font-display text-3xl font-bold tracking-[0.3em] text-kuska-gold">{devCode}</p>
                  </div>
                )}
                <form onSubmit={verify} className="space-y-4">
                  <div>
                    <label className="block mb-1.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-cream/60">
                      Código de 6 dígitos
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      required
                      className="w-full rounded-btn border border-white/30 bg-white px-4 py-3 font-body text-kuska-text placeholder:text-kuska-text-mid/50 focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 text-center tracking-[0.4em] text-lg transition-all"
                    />
                    {error && (
                      <p className="mt-1.5 font-body text-xs text-red-400">{error}</p>
                    )}
                  </div>
                  <RippleButton className="block w-full">
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Verificando…' : 'Ingresar'}
                    </Button>
                  </RippleButton>
                  <button
                    type="button"
                    onClick={() => { setStep('phone'); setError(undefined) }}
                    className="w-full font-body text-sm text-kuska-cream/55 hover:text-kuska-cream transition-colors"
                  >
                    ← Cambiar número
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <p className="mt-6 text-center font-body text-sm text-kuska-cream/55">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-semibold text-kuska-gold hover:text-kuska-gold/80 transition-colors">
            Regístrate
          </Link>
        </p>
      </AuthCard>
    </AuthBackground>
  )
}
