'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

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
      const result = await signIn('credentials', {
        phone: `+51${phone}`, otp, redirect: false,
      })
      if (result?.error) { setError('Código incorrecto o expirado'); return }
      const meRes   = await fetch('/api/auth/session')
      const session = await meRes.json()
      if (session?.user?.role === 'ARTESANO') router.push('/artesano/dashboard')
      else router.push('/marketplace')
    } catch { setError('Error al verificar')
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #070503 0%, #1A0A00 50%, #0B0804 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #C84B2F, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #2E7A6E, transparent)', filter: 'blur(60px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm"
      >
        <div className="glass rounded-3xl overflow-hidden border border-[#F0EAE0]/10">
          <div className="px-8 pt-8 pb-6 text-center border-b border-[#F0EAE0]/[0.06]">
            <Image src="/images/logo.jpeg" alt="Kuska" width={56} height={56} className="rounded-2xl mx-auto mb-4 shadow-xl" priority />
            <h1 className="text-xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Bienvenido a Kuska</h1>
            <p className="text-[#F0EAE0]/40 text-sm mt-1">
              {step === 'phone' ? 'Ingresa tu número de celular' : 'Ingresa el código que te enviamos'}
            </p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl text-sm text-[#F0EAE0]/80 border"
                style={{ background: 'rgba(200,75,47,0.1)', borderColor: 'rgba(200,75,47,0.3)' }}
              >
                {error}
              </motion.div>
            )}

            {step === 'phone' ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#F0EAE0]/40 uppercase tracking-wider mb-2">Número de celular</label>
                  <div className="flex items-center border border-[#F0EAE0]/10 rounded-xl overflow-hidden focus-within:border-[#C84B2F]/60 transition-colors duration-150"
                    style={{ background: 'rgba(240,234,224,0.04)' }}>
                    <div className="px-3 py-3 border-r border-[#F0EAE0]/10">
                      <span className="text-sm font-medium text-[#F0EAE0]/60">🇵🇪 +51</span>
                    </div>
                    <input type="tel" inputMode="numeric" maxLength={9} value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                      placeholder="9XXXXXXXX"
                      className="flex-1 px-4 py-3 text-base text-[#F0EAE0] outline-none bg-transparent placeholder:text-[#F0EAE0]/20" />
                  </div>
                </div>
                <button onClick={handleSendOTP} disabled={phone.length !== 9 || loading}
                  className="btn-press w-full py-3.5 bg-[#C84B2F] disabled:opacity-30 text-white font-semibold rounded-xl transition-colors duration-150 hover:bg-[#A83A22] text-sm">
                  {loading ? 'Enviando…' : 'Recibir código por SMS →'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-4"
              >
                <p className="text-sm text-[#F0EAE0]/40 text-center">Código enviado a <strong className="text-[#F0EAE0]/70">+51 {phone}</strong></p>
                {devOtp && (
                  <div className="p-3 rounded-xl text-center border" style={{ background: 'rgba(212,146,10,0.08)', borderColor: 'rgba(212,146,10,0.25)' }}>
                    <p className="text-xs text-[#D4920A]/70 font-semibold mb-1">Modo desarrollo — Tu OTP:</p>
                    <p className="text-2xl font-bold text-[#D4920A] tracking-widest">{devOtp}</p>
                  </div>
                )}
                <input type="text" inputMode="numeric" maxLength={6} value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()}
                  placeholder="· · · · · ·"
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 border border-[#F0EAE0]/10 rounded-xl focus:border-[#C84B2F]/60 outline-none transition-colors duration-150 text-[#F0EAE0]"
                  style={{ background: 'rgba(240,234,224,0.04)' }} />
                <button onClick={handleVerifyOTP} disabled={otp.length !== 6 || loading}
                  className="btn-press w-full py-3.5 bg-[#C84B2F] disabled:opacity-30 text-white font-semibold rounded-xl transition-colors duration-150 hover:bg-[#A83A22] text-sm">
                  {loading ? 'Verificando…' : 'Verificar e ingresar →'}
                </button>
                <button onClick={() => { setStep('phone'); setOtp(''); setDevOtp(''); setError('') }}
                  className="btn-press w-full text-sm text-[#F0EAE0]/30 hover:text-[#C84B2F] transition-colors duration-150 text-center py-1">
                  ← Cambiar número
                </button>
              </motion.div>
            )}

            <p className="text-center text-xs text-[#F0EAE0]/25 mt-6">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-[#C84B2F] hover:underline font-semibold">Regístrate aquí</Link>
            </p>
          </div>
        </div>
        <p className="text-center text-[#F0EAE0]/20 text-xs mt-6">🔒 Verificación segura · Sin contraseñas</p>
      </motion.div>
    </main>
  )
}
