'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import Kusi from '@/components/ui/Kusi'

type Role = 'ARTESANO' | 'CLIENTE'
type Step = 1 | 2 | 3 | 4

const EASE = [0.25, 0.46, 0.45, 0.94] as const

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
  const [devOtp,      setDevOtp]      = useState('')

  const sendOTP = async () => {
    if (phone.length !== 9) return
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Error al enviar'); return }
      if (data.otp) setDevOtp(data.otp)
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

  const totalSteps = role === 'ARTESANO' ? 4 : 3

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ background: '#F5F0E8' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/5 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#D4920A,transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 left-1/5 w-72 h-72 rounded-full opacity-[0.14]"
          style={{ background: 'radial-gradient(circle,#2E7A6E,transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="Kuska" width={44} height={44} className="rounded-xl" priority />
            <span className="font-display font-bold text-xl text-k-ink">Kuska</span>
          </Link>
          <h1 className="font-display font-extrabold text-2xl text-k-ink">Únete a Kuska</h1>
          <p className="text-k-ink/50 text-sm mt-1">Paso {step} de {totalSteps}</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
            <div key={s} className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: step >= s ? '#C84B2F' : 'rgba(61,28,2,0.12)' }} />
          ))}
        </div>

        <div className="liquid-glass rounded-3xl overflow-hidden">
          <div className="p-7">
            <AnimatePresence mode="wait">

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: EASE }} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Kusi size="sm" animation="bounce" />
                    <h2 className="text-lg font-bold text-k-ink font-display">¿Cómo usarás Kuska?</h2>
                  </div>
                  {([
                    { role: 'ARTESANO' as Role, title: 'Soy Artesano/a', desc: 'Vendo mis creaciones y comparto mi historia cultural', color: '#C84B2F', icon: '🏺' },
                    { role: 'CLIENTE'  as Role, title: 'Soy Emprendedor/a', desc: 'Descubro artesanía y desarrollo mi negocio con IA', color: '#2E7A6E', icon: '🚀' },
                  ] as const).map(opt => (
                    <button key={opt.role} onClick={() => { setRole(opt.role); setStep(2) }}
                      className="btn-press w-full p-5 rounded-2xl border text-left flex items-start gap-4 bg-white/50 hover:bg-white/80 transition-all"
                      style={{ borderColor: `${opt.color}33` }}>
                      <span className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${opt.color}1a` }}>{opt.icon}</span>
                      <div>
                        <div className="font-bold text-k-ink">{opt.title}</div>
                        <div className="text-sm text-k-ink/55 mt-0.5">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: EASE }} className="space-y-4">
                  <h2 className="text-lg font-bold text-k-ink font-display mb-2">Tu información básica</h2>
                  <div>
                    <label className="block text-xs font-bold text-k-ink/50 uppercase tracking-wider mb-2">
                      {role === 'ARTESANO' ? 'Nombre artesanal' : 'Tu nombre'}
                    </label>
                    <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                      placeholder={role === 'ARTESANO' ? 'Ej: María Quispe — Artesana Cusqueña' : 'Tu nombre completo'}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-k-ink/10 text-k-ink placeholder:text-k-ink/30 outline-none focus:border-k-red/60 transition-colors text-sm" />
                  </div>
                  {role === 'ARTESANO' && (
                    <div>
                      <label className="block text-xs font-bold text-k-ink/50 uppercase tracking-wider mb-2">Descripción breve</label>
                      <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                        placeholder="Cuéntanos sobre tu arte y tradición…"
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-k-ink/10 text-k-ink placeholder:text-k-ink/30 outline-none focus:border-k-red/60 transition-colors text-sm resize-none" />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-k-ink/50 uppercase tracking-wider mb-2">Número de celular</label>
                    <div className="flex items-center rounded-xl overflow-hidden bg-white/60 border border-k-ink/10 focus-within:border-k-red/60 transition-colors">
                      <span className="px-3 py-3 text-sm font-semibold text-k-ink/70 border-r border-k-ink/10">🇵🇪 +51</span>
                      <input type="tel" inputMode="numeric" maxLength={9} value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={e => e.key === 'Enter' && displayName.trim() && phone.length === 9 && sendOTP()}
                        placeholder="9XXXXXXXX"
                        className="flex-1 px-4 py-3 text-k-ink outline-none bg-transparent placeholder:text-k-ink/30 text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    {!initialRole && (
                      <button onClick={() => setStep(1)} className="btn-press px-4 py-3.5 rounded-xl text-sm font-semibold text-k-ink/60 hover:text-k-red transition-colors">←</button>
                    )}
                    <button onClick={sendOTP} disabled={!displayName.trim() || phone.length !== 9 || loading}
                      className="btn-press flex-1 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-30" style={{ background: '#C84B2F' }}>
                      {loading ? 'Enviando código…' : 'Continuar →'}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: EASE }} className="space-y-4">
                  <h2 className="text-lg font-bold text-k-ink font-display mb-1">Verifica tu número</h2>
                  <p className="text-sm text-k-ink/55">Código enviado a <strong className="text-k-ink">+51 {phone}</strong></p>
                  {devOtp && (
                    <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(212,146,10,0.1)', border: '1px solid rgba(212,146,10,0.3)' }}>
                      <p className="text-xs text-k-gold font-bold uppercase tracking-wide">Modo demo · tu código</p>
                      <p className="text-2xl font-extrabold text-k-gold tracking-[0.4em] mt-1">{devOtp}</p>
                    </div>
                  )}
                  <input type="text" inputMode="numeric" maxLength={6} value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && otp.length === 6 && verifyAndRegister()}
                    placeholder="······"
                    className="w-full text-center text-2xl font-extrabold tracking-[0.5em] py-4 rounded-xl bg-white/60 border border-k-ink/10 focus:border-k-red/60 outline-none text-k-ink" />
                  <button onClick={verifyAndRegister} disabled={otp.length !== 6 || loading}
                    className="btn-press w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-30" style={{ background: '#C84B2F' }}>
                    {loading ? 'Registrando…' : 'Crear mi cuenta →'}
                  </button>
                  <button onClick={() => setStep(2)} className="btn-press w-full text-sm text-k-ink/50 hover:text-k-red transition-colors py-1">← Volver</button>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: EASE }} className="text-center py-2 space-y-4">
                  <div className="flex justify-center"><Kusi size="lg" animation="celebrate" /></div>
                  <div>
                    <h2 className="font-display font-extrabold text-xl text-k-ink">¡Bienvenido/a a Kuska!</h2>
                    <p className="text-k-ink/55 text-sm mt-2">Tu cuenta fue creada. Ahora ingresa para comenzar.</p>
                  </div>
                  <button onClick={() => router.push('/login')}
                    className="btn-press w-full py-3.5 rounded-xl font-bold text-white text-sm" style={{ background: '#C84B2F' }}>
                    Ingresar a mi cuenta →
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-k-ink/45 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-k-red font-bold hover:underline">Inicia sesión</Link>
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
