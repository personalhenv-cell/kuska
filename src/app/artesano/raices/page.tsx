'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RaicesPage() {
  const [step,    setStep]    = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')
  const [form, setForm] = useState({
    title: '', narrative: '', culturalRegion: '',
    generationNum: '', symbols: '', technique: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.title || !form.narrative) { setError('El título y la historia son obligatorios'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/raices', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title, narrative: form.narrative,
          culturalRegion: form.culturalRegion,
          generationNum: form.generationNum ? parseInt(form.generationNum) : null,
          symbolsMeaning: form.symbols ? { descripcion: form.symbols } : null,
          technique: form.technique,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSuccess(true)
    } catch { setError('Error al guardar la historia')
    } finally { setLoading(false) }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <span className="text-6xl block mb-4">🌿</span>
          <h2 className="text-2xl font-bold text-[#3D1C02] mb-2" style={{ fontFamily: 'serif' }}>
            ¡Historia guardada!
          </h2>
          <p className="text-[#3D1C02]/60 mb-6">La historia de tu pieza ya está en el Módulo Raíces.</p>
          <Link href="/artesano/dashboard"
            className="inline-block px-6 py-3 bg-[#C84B2F] text-white font-bold rounded-xl hover:bg-[#A83A22] transition-colors">
            Volver al dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="bg-white border-b border-[#3D1C02]/10 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/artesano/dashboard" className="text-[#3D1C02]/50 hover:text-[#C84B2F] transition-colors text-sm">
          ← Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2E7A6E] rounded-xl flex items-center justify-center">🌿</div>
          <div>
            <h1 className="font-bold text-[#3D1C02] text-sm">Módulo Raíces</h1>
            <p className="text-xs text-[#3D1C02]/50">Paso {step} de 3</p>
          </div>
        </div>
      </div>

      <div className="h-1 bg-[#3D1C02]/10">
        <div className="h-full bg-gradient-to-r from-[#2E7A6E] to-[#D4920A] transition-all duration-500"
          style={{ width: `${(step/3)*100}%` }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#2E7A6E] to-[#1a5049] rounded-2xl p-6 text-white">
              <span className="text-4xl block mb-3">🌿</span>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                Cuenta la historia de tu pieza
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                El Módulo Raíces preserva el linaje cultural de tus piezas. Cada historia agrega valor único que ningún intermediario puede replicar.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3D1C02]/8 space-y-3">
              {[
                '📖 Historia y narrativa de la técnica ancestral',
                '🌍 Versiones en Quechua, Aymara y Awajún',
                '🌳 Árbol genealógico de la técnica familiar',
                '🎵 Audio narrado (próximamente)',
              ].map(item => (
                <p key={item} className="text-sm text-[#3D1C02]/70">{item}</p>
              ))}
            </div>
            <button onClick={() => setStep(2)}
              className="w-full py-3.5 bg-[#2E7A6E] text-white font-bold rounded-xl hover:bg-[#1a5049] transition-all hover:scale-[1.02] hover:shadow-lg text-sm">
              Comenzar →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3D1C02]/8">
              <h2 className="font-bold text-[#3D1C02] mb-4">La historia de tu pieza</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">Título *</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="Ej: El tejido sagrado de los Q'ero"
                    className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#2E7A6E] outline-none transition-colors text-[#3D1C02] text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">La historia *</label>
                  <textarea name="narrative" value={form.narrative} onChange={handleChange}
                    rows={5} placeholder="¿De dónde viene esta técnica? ¿Quién te la enseñó? ¿Qué significa para tu familia?"
                    className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#2E7A6E] outline-none transition-colors text-[#3D1C02] text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">Región cultural</label>
                    <input name="culturalRegion" value={form.culturalRegion} onChange={handleChange}
                      placeholder="Ej: Comunidad Q'ero, Cusco"
                      className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#2E7A6E] outline-none transition-colors text-[#3D1C02] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">Generación familiar</label>
                    <input name="generationNum" value={form.generationNum} onChange={handleChange}
                      type="number" min="1" max="20" placeholder="Ej: 4"
                      className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#2E7A6E] outline-none transition-colors text-[#3D1C02] text-sm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 border-[#3D1C02]/20 text-[#3D1C02] font-semibold rounded-xl text-sm">
                ← Atrás
              </button>
              <button onClick={() => setStep(3)} disabled={!form.title || !form.narrative}
                className="flex-1 py-3 bg-[#2E7A6E] disabled:bg-[#3D1C02]/20 disabled:text-[#3D1C02]/40 text-white font-bold rounded-xl transition-all hover:bg-[#1a5049] text-sm">
                Continuar →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3D1C02]/8">
              <h2 className="font-bold text-[#3D1C02] mb-4">Simbología y técnica</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">Significado de los símbolos</label>
                  <textarea name="symbols" value={form.symbols} onChange={handleChange}
                    rows={3} placeholder="Ej: La chakana representa la conexión entre el mundo terrenal y el cosmos..."
                    className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#2E7A6E] outline-none transition-colors text-[#3D1C02] text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3D1C02]/60 uppercase tracking-wider mb-2">Técnica utilizada</label>
                  <input name="technique" value={form.technique} onChange={handleChange}
                    placeholder="Ej: Telar de cintura, técnica ancestral de 400 años"
                    className="w-full px-4 py-3 border-2 border-[#3D1C02]/15 rounded-xl focus:border-[#2E7A6E] outline-none transition-colors text-[#3D1C02] text-sm" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#F5F0E8] to-white rounded-2xl p-5 border border-[#2E7A6E]/20">
              <p className="text-xs font-bold text-[#2E7A6E] uppercase tracking-wider mb-3">Vista previa</p>
              <h3 className="text-lg font-bold text-[#3D1C02] mb-2" style={{ fontFamily: 'serif' }}>{form.title}</h3>
              <p className="text-sm text-[#3D1C02]/70 leading-relaxed line-clamp-3">{form.narrative}</p>
              {form.culturalRegion && <p className="text-xs text-[#2E7A6E] mt-2 font-medium">📍 {form.culturalRegion}</p>}
              {form.generationNum && <p className="text-xs text-[#D4920A] mt-1 font-medium">🌳 Generación {form.generationNum}</p>}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 py-3 border-2 border-[#3D1C02]/20 text-[#3D1C02] font-semibold rounded-xl text-sm">
                ← Atrás
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3.5 bg-[#2E7A6E] disabled:bg-[#3D1C02]/20 text-white font-bold rounded-xl transition-all hover:bg-[#1a5049] hover:scale-[1.02] hover:shadow-lg text-sm">
                {loading ? 'Guardando...' : '🌿 Publicar historia'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
