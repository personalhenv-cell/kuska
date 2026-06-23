'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState('')
  const [step,    setStep]    = useState<'phone'|'otp'>('phone')
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    if (phone.length < 9) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep('otp') }, 1200)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A0A00 0%, #3D1C02 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#C84B2F] opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#2E7A6E] opacity-10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#3D1C02] px-8 py-8 text-center">
            <Image src="/images/logo.jpeg" alt="Kuska" width={60} height={60} className="rounded-xl mx-auto mb-3 shadow-lg" />
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'serif' }}>Bienvenido a Kuska</h1>
            <p className="text-white/50 text-sm mt-1">{step === 'phone' ? 'Ingresa tu número de celular' : 'Ingresa el código SMS'}</p>
          </div>
          <div className="px-8 py-8">
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
                      placeholder="9XXXXXXXX"
                      className="flex-1 px-4 py-3 text-base text-[#3D1C02] outline-none bg-transparent placeholder:text-[#3D1C02]/30" />
                  </div>
                </div>
                <button onClick={handleSend} disabled={phone.length < 9 || loading}
                  className="w-full py-3.5 bg-[#C84B2F] disabled:bg-[#3D1C02]/20 disabled:text-[#3D1C02]/40 text-white font-bold rounded-xl transition-all hover:bg-[#A83A22] hover:scale-[1.02] hover:shadow-lg text-sm">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Enviando...
                    </span>
                  ) : 'Recibir código por SMS →'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[#3D1C02]/60 text-center">Código enviado a <strong>+51 {phone}</strong></p>
                <input type="text" inputMode="numeric" maxLength={6} value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                  placeholder="· · · · · ·"
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02]" />
                <button className="w-full py-3.5 bg-[#C84B2F] text-white font-bold rounded-xl hover:bg-[#A83A22] hover:scale-[1.02] transition-all text-sm">
                  Verificar e ingresar →
                </button>
                <button onClick={() => setStep('phone')} className="w-full text-sm text-[#3D1C02]/50 hover:text-[#C84B2F] transition-colors text-center">
                  ← Cambiar número
                </button>
              </div>
            )}
            <p className="text-center text-xs text-[#3D1C02]/40 mt-6">
              ¿No tienes cuenta?{' '}
              <Link href="/" className="text-[#C84B2F] font-semibold hover:underline">Regístrate aquí</Link>
            </p>
          </div>
        </div>
        <p className="text-center text-white/30 text-xs mt-6">🔒 Verificación segura · Sin contraseñas</p>
      </div>
    </main>
  )
}
