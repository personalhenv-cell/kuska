'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Suspense } from 'react'

type Role = 'ARTESANO' | 'CLIENTE'
type Step = 1 | 2 | 3 | 4

function RegistroForm() {
  const router = useRouter()
  const params = useSearchParams()
  const initialRole = params.get('rol') === 'artesano' ? 'ARTESANO' : params.get('rol') === 'cliente' ? 'CLIENTE' : null

  const [role,        setRole]        = useState<Role | null>(initialRole)
  const [step,        setStep]        = useState<Step>(initialRole ? 2 : 1)
  const [loading,     setLoading]     = useState(false)
  const [phone,       setPhone]       = useState('')
  const [otp,         setOtp]         = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio,         setBio]         = useState('')
  const [otpSent,     setOtpSent]     = useState(false)
  const [devOtp,      setDevOtp]      = useState('')

  const sendOTP = async () => {
    if (phone.length !== 9) return
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Error al enviar'); return }
      if (data.otp) setDevOtp(data.otp)
      setOtpSent(true)
      setStep(3)
      toast.success('Código enviado')
    } catch { toast.error('Error de conexión')
    } finally { setLoading(false) }
  }

  const verifyAndRegister = async () => {
    if (otp.length !== 6 || !role || !displayName.trim()) return
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role, displayName: displayName.trim(), bio: bio.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Error al registrar'); return }
      setStep(4)
    } catch { toast.error('Error de conexión')
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #070503 0%, #1A0A00 50%, #0B0804 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #D4920A, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #2E7A6E, transparent)', filter: 'blur(60px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Image src="/images/logo.jpeg" alt="Kuska" width={52} height={52} className="rounded-2xl mx-auto mb-4" priority />
          <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>Únete a Kuska</h1>
          <p className="text-[#F0EAE0]/40 text-sm mt-1">Paso {step} de {role === 'ARTESANO' ? 4 : 3}</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3, role === 'ARTESANO' ? 4 : null].filter(Boolean).map(s => (
            <div key={s} className="flex-1 h-0.5 rounded-full transition-all duration-300"
              style={{ background: (step ?? 0) >= (s ?? 0) ? '#C84B2F' : 'rgba(240,234,224,0.1)' }} />
          ))}
        </div>

        <div className="glass rounded-3xl border border-[#F0EAE0]/10 overflow-hidden">
          <div className="p-8">
            <AnimatePresence mode="wait">

              {/* Step 1: Elegir rol */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }} className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#F0EAE0] mb-6">¿Cómo quieres usar Kuska?</h2>
                  {([
                    { role: 'ARTESANO' as Role, title: 'Soy Artesano/a', desc: 'Vendo mis creaciones y comparto mi historia cultural', color: '#C84B2F', icon: '🏺' },
                    { role: 'CLIENTE'  as Role, title: 'Soy Emprendedor/a', desc: 'Descubro artesanía y desarrollo mi negocio con IA', color: '#2E7A6E', icon: '🚀' },
                  ] as const).map(opt => (
                    <button key={opt.role} onClick={() => { setRole(opt.role); setStep(2) }}
                      className="btn-press w-full p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-150 hover:border-current"
                      style={{ background: 'rgba(240,234,224,0.03)', borderColor: 'rgba(240,234,224,0.08)' }}>
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <div className="font-semibold text-[#F0EAE0]">{opt.title}</div>
                        <div className="text-sm text-[#F0EAE0]/40 mt-0.5">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Step 2: Datos básicos */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }} className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#F0EAE0] mb-6">Tu información básica</h2>
                  <div>
                    <label className="block text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">
                      {role === 'ARTESANO' ? 'Nombre artesanal' : 'Tu nombre'}
                    </label>
                    <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                      placeholder={role === 'ARTESANO' ? 'Ej: María Quispe — Artesana Cusqueña' : 'Tu nombre completo'}
                      className="w-full px-4 py-3 rounded-xl border border-[#F0EAE0]/10 text-[#F0EAE0] placeholder:text-[#F0EAE0]/20 outline-none focus:border-[#C84B2F]/60 transition-colors duration-150 text-sm"
                      style={{ background: 'rgba(240,234,224,0.04)' }} />
                  </div>
                  {role === 'ARTESANO' && (
                    <div>
                      <label className="block text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">Descripción breve</label>
                      <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                        placeholder="Cuéntanos sobre tu arte y tradición…"
                        className="w-full px-4 py-3 rounded-xl border border-[#F0EAE0]/10 text-[#F0EAE0] placeholder:text-[#F0EAE0]/20 outline-none focus:border-[#C84B2F]/60 transition-colors duration-150 text-sm resize-none"
                        style={{ background: 'rgba(240,234,224,0.04)' }} />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">Número de celular</label>
                    <div className="flex items-center border border-[#F0EAE0]/10 rounded-xl overflow-hidden focus-within:border-[#C84B2F]/60 transition-colors duration-150"
                      style={{ background: 'rgba(240,234,224,0.04)' }}>
                      <div className="px-3 py-3 border-r border-[#F0EAE0]/10">
                        <span className="text-sm text-[#F0EAE0]/60">🇵🇪 +51</span>
                      </div>
                      <input type="tel" inputMode="numeric" maxLength={9} value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={e => e.key === 'Enter' && displayName.trim() && phone.length === 9 && sendOTP()}
                        placeholder="9XXXXXXXX"
                        className="flex-1 px-4 py-3 text-[#F0EAE0] outline-none bg-transparent placeholder:text-[#F0EAE0]/20 text-sm" />
                    </div>
                  </div>
                  <button onClick={sendOTP} disabled={!displayName.trim() || phone.length !== 9 || loading}
                    className="btn-press w-full py-3.5 bg-[#C84B2F] disabled:opacity-30 text-white font-semibold rounded-xl transition-colors duration-150 hover:bg-[#A83A22] text-sm mt-2">
                    {loading ? 'Enviando código…' : 'Continuar →'}
                  </button>
                </motion.div>
              )}

              {/* Step 3: OTP */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }} className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#F0EAE0] mb-2">Verifica tu número</h2>
                  <p className="text-sm text-[#F0EAE0]/40">Código enviado a <strong className="text-[#F0EAE0]/70">+51 {phone}</strong></p>
                  {devOtp && (
                    <div className="p-3 rounded-xl text-center border" style={{ background: 'rgba(212,146,10,0.08)', borderColor: 'rgba(212,146,10,0.25)' }}>
                      <p className="text-xs text-[#D4920A]/70 font-semibold mb-1">Modo desarrollo:</p>
                      <p className="text-2xl font-bold text-[#D4920A] tracking-widest">{devOtp}</p>
                    </div>
                  )}
                  <input type="text" inputMode="numeric" maxLength={6} value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && otp.length === 6 && verifyAndRegister()}
                    placeholder="· · · · · ·"
                    className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 border border-[#F0EAE0]/10 rounded-xl focus:border-[#C84B2F]/60 outline-none transition-colors duration-150 text-[#F0EAE0]"
                    style={{ background: 'rgba(240,234,224,0.04)' }} />
                  <button onClick={verifyAndRegister} disabled={otp.length !== 6 || loading}
                    className="btn-press w-full py-3.5 bg-[#C84B2F] disabled:opacity-30 text-white font-semibold rounded-xl transition-colors duration-150 hover:bg-[#A83A22] text-sm">
                    {loading ? 'Registrando…' : 'Crear mi cuenta →'}
                  </button>
                  <button onClick={() => setStep(2)}
                    className="w-full text-sm text-[#F0EAE0]/30 hover:text-[#C84B2F] transition-colors duration-150 text-center py-1">
                    ← Volver
                  </button>
                </motion.div>
              )}

              {/* Step 4: ¡Bienvenido! */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }} className="text-center py-4 space-y-5">
                  <div className="text-5xl">🎉</div>
                  <div>
                    <h2 className="text-xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      ¡Bienvenido/a a Kuska!
                    </h2>
                    <p className="text-[#F0EAE0]/40 text-sm mt-2">Tu cuenta ha sido creada. Ahora ingresa para comenzar.</p>
                  </div>
                  <button onClick={() => router.push('/login')}
                    className="btn-press w-full py-3.5 bg-[#C84B2F] hover:bg-[#A83A22] text-white font-semibold rounded-xl transition-colors duration-150 text-sm">
                    Ingresar a mi cuenta →
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-[#F0EAE0]/25 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-[#C84B2F] hover:underline">Inicia sesión</Link>
        </p>
      </motion.div>
    </main>
  )
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  )
}
