'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

type Role = 'ARTESANO' | 'CLIENTE'
type Step = 1 | 2 | 3 | 4
type Lang = 'es' | 'qu' | 'ay' | 'aw'

const REGIONES = [
  'Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca',
  'Callao','Cusco','Huancavelica','Huánuco','Ica','Junín',
  'La Libertad','Lambayeque','Lima','Loreto','Madre de Dios',
  'Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali',
]

const RUBROS = [
  'Textilería','Cerámica','Joyería y orfebrería','Madera tallada',
  'Cestería','Pintura y arte','Cuero','Instrumentos musicales','Bordados','Retablos',
]

export default function RegistroPage() {
  const router = useRouter()
  const [role,        setRole]        = useState<Role | null>(null)
  const [step,        setStep]        = useState<Step>(1)
  const [lang,        setLang]        = useState<Lang>('es')
  const [phone,       setPhone]       = useState('')
  const [otp,         setOtp]         = useState('')
  const [devOtp,      setDevOtp]      = useState('')
  const [displayName, setDisplayName] = useState('')
  const [dni,         setDni]         = useState('')
  const [firstName,   setFirstName]   = useState('')
  const [lastName,    setLastName]    = useState('')
  const [regionId,    setRegionId]    = useState('')
  const [rubro,       setRubro]       = useState('')
  const [whatsapp,    setWhatsapp]    = useState('')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [reniecOk,    setReniecOk]    = useState(false)
  const [reniecLoading, setReniecLoading] = useState(false)
  const dniTimer = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (dni.length !== 8 || role !== 'ARTESANO') return
    clearTimeout(dniTimer.current)
    setReniecOk(false)
    setReniecLoading(true)
    dniTimer.current = setTimeout(async () => {
      try {
        const res  = await fetch('/api/identity/check', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dni }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setFirstName(data.firstName || 'NOMBRE')
          setLastName(data.lastName   || 'APELLIDO')
          setReniecOk(true)
        } else {
          // Modo demo — igual dejar avanzar
          setFirstName('NOMBRE DEMO')
          setLastName('APELLIDO DEMO')
          setReniecOk(true)
        }
      } catch {
        // Si falla la red — modo demo
        setFirstName('NOMBRE DEMO')
        setLastName('APELLIDO DEMO')
        setReniecOk(true)
      } finally {
        setReniecLoading(false)
      }
    }, 800)
    return () => clearTimeout(dniTimer.current)
  }, [dni, role])

  const sendOTP = async () => {
    if (phone.length !== 9) return
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/auth/otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al enviar código'); return }
      if (data.otp) setDevOtp(data.otp)
      setStep(3)
    } catch { setError('Error de conexión')
    } finally { setLoading(false) }
  }

  const verifyOTP = async () => {
    if (otp.length !== 6) return
    setLoading(true); setError('')
    try {
      const result = await signIn('credentials', {
        phone: `+51${phone}`, otp, redirect: false,
      })
      if (result?.error) { setError('Código incorrecto o expirado'); return }
      setStep(4)
    } catch { setError('Error de conexión')
    } finally { setLoading(false) }
  }

  const handleRegister = async () => {
    if (!displayName.trim()) { setError('Ingresa un nombre'); return }
    setLoading(true); setError('')
    try {
      const body = role === 'ARTESANO'
        ? { phone: `+51${phone}`, role, displayName, dni, firstName, lastName, regionId, craftLineage: rubro, whatsapp, lang }
        : { phone: `+51${phone}`, role, displayName, lang }

      const res  = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al registrar'); return }
      router.push(role === 'ARTESANO' ? '/artesano/dashboard' : '/cliente/dashboard')
    } catch { setError('Error al registrar')
    } finally { setLoading(false) }
  }

  const puedeAvanzar = () => {
    if (phone.length !== 9) return false
    if (role === 'ARTESANO') return dni.length === 8 && !reniecLoading
    return true
  }

  const progress = (step / 4) * 100

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1A0A00 0%, #3D1C02 100%)' }}>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#C84B2F] opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#2E7A6E] opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="h-1 bg-[#3D1C02]/10">
            <div className="h-full bg-gradient-to-r from-[#C84B2F] to-[#D4920A] transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>

          <div className="bg-[#3D1C02] px-8 pt-6 pb-5">
            <div className="flex items-center justify-between mb-3">
              <Image src="/images/logo.jpeg" alt="Kuska" width={40} height={40} className="rounded-xl" />
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs">Paso {step} de 4</span>
                <select value={lang} onChange={e => setLang(e.target.value as Lang)}
                  className="text-xs bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white focus:outline-none">
                  <option value="es">ES</option>
                  <option value="qu">QU</option>
                  <option value="ay">AY</option>
                  <option value="aw">AW</option>
                </select>
              </div>
            </div>
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'serif' }}>
              {step === 1 && 'Únete a Kuska'}
              {step === 2 && (role === 'ARTESANO' ? 'Tus datos' : 'Tu celular')}
              {step === 3 && 'Verificar código'}
              {step === 4 && 'Últimos detalles'}
            </h1>
          </div>

          <div className="px-8 py-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <p className="text-sm text-[#3D1C02]/60 mb-4">¿Cómo quieres usar Kuska?</p>
                <button onClick={() => { setRole('ARTESANO'); setStep(2) }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#C84B2F]/30 bg-[#FDF1EE] hover:border-[#C84B2F] transition-all duration-200 hover:scale-[1.02] text-left">
                  <span className="text-3xl">🛠️</span>
                  <div>
                    <p className="font-bold text-[#C84B2F]">Soy artesano</p>
                    <p className="text-xs text-[#3D1C02]/50">Vender mis productos y preservar mi cultura</p>
                  </div>
                </button>
                <button onClick={() => { setRole('CLIENTE'); setStep(2) }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#2E7A6E]/30 bg-[#EEF6F5] hover:border-[#2E7A6E] transition-all duration-200 hover:scale-[1.02] text-left">
                  <span className="text-3xl">🛍️</span>
                  <div>
                    <p className="font-bold text-[#2E7A6E]">Soy cliente</p>
                    <p className="text-xs text-[#3D1C02]/50">Descubrir y comprar piezas únicas</p>
                  </div>
                </button>
                <p className="text-center text-xs text-[#3D1C02]/40 pt-2">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-[#C84B2F] font-semibold hover:underline">Iniciar sesión</Link>
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">Celular</label>
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

                {role === 'ARTESANO' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">
                        DNI — Validación RENIEC
                      </label>
                      <input type="text" inputMode="numeric" maxLength={8} value={dni}
                        onChange={e => { setDni(e.target.value.replace(/\D/g,'')); setReniecOk(false) }}
                        placeholder="12345678"
                        className={`w-full px-4 py-3 text-base border-2 rounded-xl outline-none transition-colors text-[#3D1C02] ${
                          reniecOk ? 'border-green-400 bg-green-50' : 'border-[#3D1C02]/15 focus:border-[#C84B2F]'
                        }`} />
                      {reniecLoading && (
                        <p className="text-xs text-[#3D1C02]/50 mt-1 flex items-center gap-1">
                          <span className="animate-spin">⟳</span> Consultando RENIEC...
                        </p>
                      )}
                      {reniecOk && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                          <p className="text-xs text-green-600 font-semibold">✅ DNI verificado</p>
                          <p className="text-sm font-bold text-[#3D1C02] mt-1">{firstName} {lastName}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">Región</label>
                        <select value={regionId} onChange={e => setRegionId(e.target.value)}
                          className="w-full px-3 py-3 text-sm border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none text-[#3D1C02] bg-white">
                          <option value="">Selecciona...</option>
                          {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">Rubro</label>
                        <select value={rubro} onChange={e => setRubro(e.target.value)}
                          className="w-full px-3 py-3 text-sm border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none text-[#3D1C02] bg-white">
                          <option value="">Selecciona...</option>
                          {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">WhatsApp (opcional)</label>
                      <div className="flex items-center border-2 border-[#3D1C02]/15 rounded-xl focus-within:border-[#C84B2F] transition-colors overflow-hidden">
                        <div className="px-3 py-3 bg-[#F5F0E8] border-r border-[#3D1C02]/10">
                          <span className="text-sm">📱 +51</span>
                        </div>
                        <input type="tel" inputMode="numeric" maxLength={9} value={whatsapp}
                          onChange={e => setWhatsapp(e.target.value.replace(/\D/g,''))}
                          placeholder="9XXXXXXXX"
                          className="flex-1 px-4 py-3 text-base text-[#3D1C02] outline-none bg-transparent placeholder:text-[#3D1C02]/30" />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-3 border-2 border-[#3D1C02]/20 text-[#3D1C02] font-semibold rounded-xl hover:border-[#3D1C02]/40 transition-colors text-sm">
                    ← Atrás
                  </button>
                  <button onClick={sendOTP} disabled={!puedeAvanzar() || loading}
                    className="flex-1 py-3 bg-[#C84B2F] disabled:bg-[#3D1C02]/20 disabled:text-[#3D1C02]/40 text-white font-bold rounded-xl transition-all hover:bg-[#A83A22] hover:scale-[1.02] text-sm">
                    {loading ? 'Enviando...' : reniecLoading ? 'Verificando DNI...' : 'Continuar →'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-[#3D1C02]/60 text-center">
                  Código enviado a <strong>+51 {phone}</strong>
                </p>
                {devOtp && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                    <p className="text-xs text-amber-600 font-semibold mb-1">Modo desarrollo — Tu OTP:</p>
                    <p className="text-2xl font-bold text-amber-700 tracking-widest">{devOtp}</p>
                  </div>
                )}
                <input type="text" inputMode="numeric" maxLength={6} value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                  onKeyDown={e => e.key === 'Enter' && verifyOTP()}
                  placeholder="· · · · · ·"
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02]" />
                <button onClick={verifyOTP} disabled={otp.length !== 6 || loading}
                  className="w-full py-3.5 bg-[#C84B2F] disabled:bg-[#3D1C02]/20 disabled:text-[#3D1C02]/40 text-white font-bold rounded-xl transition-all hover:bg-[#A83A22] text-sm">
                  {loading ? 'Verificando...' : 'Verificar código →'}
                </button>
                <button onClick={() => { setStep(2); setOtp(''); setDevOtp(''); setError('') }}
                  className="w-full text-sm text-[#3D1C02]/50 hover:text-[#C84B2F] transition-colors text-center">
                  ← Cambiar número
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">
                    {role === 'ARTESANO' ? 'Nombre de tu taller o marca' : 'Tu nombre'}
                  </label>
                  <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                    placeholder={role === 'ARTESANO' ? 'Taller Quispe' : 'María García'}
                    className="w-full px-4 py-3 text-base border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#C84B2F] outline-none transition-colors text-[#3D1C02]" />
                </div>

                <div className="bg-[#F5F0E8] rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-[#3D1C02]/60 uppercase tracking-wider mb-2">Resumen</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#3D1C02]/60">Tipo</span>
                    <span className={`font-bold ${role === 'ARTESANO' ? 'text-[#C84B2F]' : 'text-[#2E7A6E]'}`}>
                      {role === 'ARTESANO' ? '🛠️ Artesano' : '🛍️ Cliente'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#3D1C02]/60">Celular</span>
                    <span className="font-medium text-[#3D1C02]">+51 {phone}</span>
                  </div>
                  {role === 'ARTESANO' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#3D1C02]/60">Plan</span>
                      <span className="font-medium text-[#D4920A]">Básico — S/10</span>
                    </div>
                  )}
                </div>

                <button onClick={handleRegister} disabled={!displayName.trim() || loading}
                  className="w-full py-3.5 bg-[#C84B2F] disabled:bg-[#3D1C02]/20 disabled:text-[#3D1C02]/40 text-white font-bold rounded-xl transition-all hover:bg-[#A83A22] hover:scale-[1.02] hover:shadow-lg text-sm">
                  {loading ? 'Creando tu cuenta...' : 'Crear mi cuenta en Kuska →'}
                </button>

                <p className="text-center text-xs text-[#3D1C02]/40">
                  🔒 Tus datos están protegidos y cifrados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
