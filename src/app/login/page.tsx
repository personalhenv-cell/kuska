'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState('')
  const [step,    setStep]    = useState<'phone'|'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [devOtp,  setDevOtp]  = useState('')

  const handleSendOTP = async () => {
    if (phone.length !== 9) return
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/auth/otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
      style={{ background: 'linear-gradient(135deg, #1A0A00 0%, #3D1C02 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#C84B2F] opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#2E7A6E] opacity-10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#3D1C02] px-8 py-8 text-center">
            <Image src="/images/logo.jpeg" alt="Kuska" width={60} height={60} className="rounded-xl mx-auto mb-3 shadow-lg" priority />
            <h1 className="text-xl font-bold text-white" style={{ fontFamily:'serif' }}>Bienvenido a Kuska</h1>
            <p className="text-white/50 text-sm mt-1">
              {step === 'phone' ? 'Ingresa tu número de celular' : 'Ingresa el código que te enviamos'}
            </p>
          </div>
          <div className="px-8 py-8">
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}
            {step === 'phone' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">Número de celular</label>
                  <div className="flex items-center border-2 border-[#3D1C02]/15 rounded-xl focus-within:border-[#C84B2F] transition-colors overflow-hidden">
                    <div className="px-3 py-3 bg-[#F5F0E8] border-r border-[#3D1C02]/10">
                      <span className="text-sm font-medium text-[#3D1C02]">🇵🇪 +51</span>
                    </div>
                    <input type="tel" inputMode="numeric" maxLength={9} value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                      onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                      placeholder="9XXXXXXXX"
                      className="flex-1 px-4 py-3 text-base text-[#3D1C02] outline-none bg-transparent placeholder:text-[#3D1C02]/30" />
                  </div>
                </div>
                <button onClick={handleSendOTP} disabled={phone.length !== 9 || loading}
                  className="w-full py-3.5 bg-[#C84B2F] disabled:bg-[#3D1C02]/20 disabled:text-[#3D1C02]/40 text-white font-bold rounded-xl transition-all hover:bg-[#A83A22] hover:scale-[1.02] hover:shadow-lg text-sm">
                  {loading ? 'Enviando...' : 'Recibir código por SMS →'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[#3D1C02]/60 text-center">Código enviado a <strong>+51 {phone}</strong></p>
                {devOtp && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                    <p className="text-xs text-amber-600 font-semibold mb-1">Modo desarrollo — Tu OTP:</p>
                    <p className="text-2xl font-bold text-amber-700 tracking-widest">{devOtp}</p>
                  </div>
                )}
                <input type="text" inputMode="numeric" maxLength={6} value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()}
                  placeholder="· · · · · ·"
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02]" />
                <button onClick={handleVerifyOTP} disabled={otp.length !== 6 || loading}
                  className="w-full py-3.5 bg-[#C84B2F] disabled:bg-[#3D1C02]/20 disabled:text-[#3D1C02]/40 text-white font-bold rounded-xl transition-all hover:bg-[#A83A22] text-sm">
                  {loading ? 'Verificando...' : 'Verificar e ingresar →'}
                </button>
                <button onClick={() => { setStep('phone'); setOtp(''); setDevOtp(''); setError('') }}
                  className="w-full text-sm text-[#3D1C02]/50 hover:text-[#C84B2F] transition-colors text-center">
                  ← Cambiar número
                </button>
              </div>
            )}
            <p className="text-center text-xs text-[#3D1C02]/40 mt-6">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-[#C84B2F] font-semibold hover:underline">Regístrate aquí</Link>
            </p>
          </div>
        </div>
        <p className="text-center text-white/30 text-xs mt-6">🔒 Verificación segura · Sin contraseñas</p>
      </div>
    </main>
  )
}
