'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Kusi from '@/components/ui/Kusi'

const EASE = [0.25, 0.46, 0.45, 0.94] as const

export default function LoginPage() {
  const router = useRouter()
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState('')
  const [step,    setStep]    = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [devOtp,  setDevOtp]  = useState('')

  const handleSendOTP = async () => {
    if (phone.length !== 9) return
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al enviar'); return }
      if (data.otp) setDevOtp(data.otp)
      setStep('otp')
    } catch { setError('Error de conexión')
    } finally { setLoading(false) }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return
    setLoading(true); setError('')
    try {
      const result = await signIn('credentials', { phone: `+51${phone}`, otp, redirect: false })
      if (result?.error) { setError('Código incorrecto o expirado'); return }
      const meRes   = await fetch('/api/auth/session')
      const session = await meRes.json()
      if (session?.user?.role === 'ARTESANO') router.push('/artesano/dashboard')
      else if (session?.user?.role === 'ADMIN') router.push('/admin/dashboard')
      else router.push('/marketplace')
    } catch { setError('Error al verificar')
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2" style={{ background: '#F5F0E8' }}>
      {/* Panel de marca (izquierda) */}
      <aside className="relative hidden md:flex flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#3D1C02 0%,#5A2D0C 100%)' }}>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle,#D4920A,transparent 70%)' }} />
        <Link href="/" className="relative flex items-center gap-3 text-[#F5F0E8]">
          <Image src="/logo.png" alt="Kuska" width={40} height={40} className="rounded-xl" priority />
          <span className="font-display font-bold text-2xl">Kuska</span>
        </Link>

        <div className="relative">
          <Kusi size="lg" animation="wave" priority />
          <h2 className="font-display font-extrabold text-4xl text-[#F5F0E8] mt-6 leading-tight">
            Bienvenido<br />de vuelta
          </h2>
          <p className="text-[#F5F0E8]/70 mt-3 max-w-xs">
            Tu taller, tu comunidad y tus herramientas — todo en un solo lugar.
          </p>
        </div>

        <p className="relative text-[#F5F0E8]/45 text-sm font-display italic">
          «Kuska» — juntos, en quechua 🦙
        </p>
      </aside>

      {/* Formulario (derecha) */}
      <section className="flex items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="w-full max-w-sm"
        >
          {/* Logo móvil */}
          <Link href="/" className="md:hidden flex items-center justify-center gap-2 mb-8">
            <Image src="/logo.png" alt="Kuska" width={40} height={40} className="rounded-xl" priority />
            <span className="font-display font-bold text-2xl text-k-ink">Kuska</span>
          </Link>

          <div className="liquid-glass rounded-3xl p-8">
            <h1 className="font-display font-bold text-2xl text-k-ink">
              {step === 'phone' ? 'Ingresa a tu cuenta' : 'Verifica tu número'}
            </h1>
            <p className="text-k-ink/55 text-sm mt-1">
              {step === 'phone' ? 'Te enviaremos un código por SMS' : `Código enviado a +51 ${phone}`}
            </p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-4 p-3 rounded-xl text-sm font-medium"
                  style={{ background: 'rgba(200,75,47,0.1)', color: '#A83A22', border: '1px solid rgba(200,75,47,0.25)' }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {step === 'phone' ? (
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-bold text-k-ink/50 uppercase tracking-wider">Número de celular</label>
                <div className="flex items-center rounded-xl overflow-hidden bg-white/60 border border-k-ink/10 focus-within:border-k-red/60 transition-colors">
                  <span className="px-3 py-3 text-sm font-semibold text-k-ink/70 border-r border-k-ink/10">🇵🇪 +51</span>
                  <input
                    type="tel" inputMode="numeric" maxLength={9} value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                    placeholder="9XXXXXXXX" autoFocus
                    className="flex-1 px-4 py-3 text-base text-k-ink outline-none bg-transparent placeholder:text-k-ink/30"
                  />
                </div>
                <button onClick={handleSendOTP} disabled={phone.length !== 9 || loading}
                  className="btn-press w-full py-3.5 rounded-xl font-bold text-white text-sm transition-opacity disabled:opacity-30"
                  style={{ background: '#C84B2F' }}>
                  {loading ? 'Enviando…' : 'Recibir código por SMS →'}
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {devOtp && (
                  <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(212,146,10,0.1)', border: '1px solid rgba(212,146,10,0.3)' }}>
                    <p className="text-xs text-k-gold font-bold uppercase tracking-wide">Modo demo · tu código</p>
                    <p className="text-2xl font-extrabold text-k-gold tracking-[0.4em] mt-1">{devOtp}</p>
                  </div>
                )}
                <input
                  type="text" inputMode="numeric" maxLength={6} value={otp} autoFocus
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()}
                  placeholder="······"
                  className="w-full text-center text-2xl font-extrabold tracking-[0.5em] py-4 rounded-xl bg-white/60 border border-k-ink/10 focus:border-k-red/60 outline-none text-k-ink"
                />
                <button onClick={handleVerifyOTP} disabled={otp.length !== 6 || loading}
                  className="btn-press w-full py-3.5 rounded-xl font-bold text-white text-sm transition-opacity disabled:opacity-30"
                  style={{ background: '#C84B2F' }}>
                  {loading ? 'Verificando…' : 'Verificar e ingresar →'}
                </button>
                <button onClick={() => { setStep('phone'); setOtp(''); setDevOtp(''); setError('') }}
                  className="btn-press w-full text-sm text-k-ink/50 hover:text-k-red transition-colors py-1">
                  ← Cambiar número
                </button>
              </div>
            )}

            <p className="text-center text-xs text-k-ink/45 mt-6">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-k-red font-bold hover:underline">Regístrate aquí</Link>
            </p>
          </div>
          <p className="text-center text-k-ink/35 text-xs mt-5">🔒 Verificación segura · Sin contraseñas</p>
        </motion.div>
      </section>
    </main>
  )
}
