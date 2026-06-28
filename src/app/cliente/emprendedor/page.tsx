'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Message { role: 'user' | 'assistant'; content: string }
interface Plan {
  resumen: string; propuestaValor: string; mercadoObjetivo: string; modeloNegocio: string
  pasos: Array<{ mes: number; accion: string; meta: string }>
  inversionInicial: { minimo: number; recomendado: number; descripcion: string }
  ingresoEsperado: { mes3: number; mes6: number; mes12: number }
  riesgos: string[]; oportunidades: string[]; conexionKuska: string
}

const SUGGESTIONS = ['Quiero vender artesanías por Instagram', 'Tengo una idea de café cultural artesano', 'Quiero exportar textiles peruanos', 'Idea de tour artesanal en Cusco']

export default function EmprendedorPage() {
  const [tab,       setTab]       = useState<'chat' | 'plan'>('chat')
  const [messages,  setMessages]  = useState<Message[]>([])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [history,   setHistory]   = useState<Message[]>([])
  const [ideaTitle, setIdeaTitle] = useState('')
  const [ideaDesc,  setIdeaDesc]  = useState('')
  const [plan,      setPlan]      = useState<Plan | null>(null)
  const [generating, setGenerating] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendChat = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return
    const userMsg: Message = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages); setInput(''); setLoading(true)
    try {
      const res  = await fetch('/api/emprendedor/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: content, history }) })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Error'); return }
      const assistantMsg: Message = { role: 'assistant', content: data.message }
      setMessages([...newMessages, assistantMsg])
      setHistory([...newMessages, assistantMsg])
    } catch { toast.error('Error de conexión')
    } finally { setLoading(false) }
  }

  const generatePlan = async () => {
    if (!ideaTitle.trim() || !ideaDesc.trim()) { toast.error('Completa tu idea'); return }
    setGenerating(true)
    try {
      const res  = await fetch('/api/emprendedor/chat', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ideaTitle, ideaDesc }) })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Error'); return }
      setPlan(data.plan)
      toast.success('Plan generado')
    } catch { toast.error('Error al generar plan')
    } finally { setGenerating(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <h1 className="text-2xl font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>IA Emprendedor</h1>
        <p className="text-[#F0EAE0]/40 text-sm mt-1">Tu asesor de negocios personal · Powered by Claude</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(240,234,224,0.04)', border: '1px solid rgba(240,234,224,0.08)' }}>
        {([['chat', '💬 Consultor IA'], ['plan', '📋 Generar Plan']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn-press flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={tab === t ? { background: '#2E7A6E', color: '#fff' } : { color: 'rgba(240,234,224,0.45)' }}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'chat' ? (
          <motion.div key="chat" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col h-[calc(100vh-18rem)]">
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🚀</div>
                  <p className="text-[#F0EAE0]/50 text-sm mb-6">Cuéntame tu idea de negocio y te ayudo a desarrollarla.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map(s => (
                      <button key={s} onClick={() => sendChat(s)}
                        className="btn-press text-xs px-3 py-2 rounded-full glass border border-[#F0EAE0]/10 text-[#F0EAE0]/55 hover:text-[#F0EAE0] transition-colors duration-150">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'text-white rounded-br-sm' : 'text-[#F0EAE0]/85 border border-[#F0EAE0]/[0.07] rounded-bl-sm'}`}
                    style={msg.role === 'user' ? { background: '#2E7A6E' } : { background: 'rgba(240,234,224,0.04)' }}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl border border-[#F0EAE0]/[0.07]" style={{ background: 'rgba(240,234,224,0.04)' }}>
                    <div className="flex gap-1.5">
                      {[0, 0.15, 0.3].map(d => (
                        <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-[#F0EAE0]/40"
                          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: d }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="flex gap-3 items-end glass rounded-2xl border border-[#F0EAE0]/10 p-3">
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }}
                placeholder="Describe tu idea de negocio…" rows={1}
                className="flex-1 bg-transparent text-[#F0EAE0] placeholder:text-[#F0EAE0]/25 outline-none resize-none text-sm" style={{ maxHeight: '100px' }} />
              <button onClick={() => sendChat()} disabled={!input.trim() || loading}
                className="btn-press w-9 h-9 flex items-center justify-center rounded-xl disabled:opacity-30 flex-shrink-0" style={{ background: '#2E7A6E' }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="plan" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }} className="space-y-5">
            {!plan ? (
              <div className="glass rounded-2xl p-6 space-y-4">
                <h2 className="text-[#F0EAE0] font-semibold">Describe tu idea de negocio</h2>
                <div>
                  <label className="block text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">Nombre de la idea</label>
                  <input value={ideaTitle} onChange={e => setIdeaTitle(e.target.value)} placeholder="Ej: Tienda online de textiles andinos"
                    className="w-full px-4 py-3 rounded-xl border border-[#F0EAE0]/10 text-[#F0EAE0] placeholder:text-[#F0EAE0]/20 outline-none focus:border-[#2E7A6E]/60 transition-colors duration-150 text-sm"
                    style={{ background: 'rgba(240,234,224,0.04)' }} />
                </div>
                <div>
                  <label className="block text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">Descripción detallada</label>
                  <textarea value={ideaDesc} onChange={e => setIdeaDesc(e.target.value)} rows={4}
                    placeholder="Explica qué quieres hacer, a quién va dirigido, qué problema resuelve…"
                    className="w-full px-4 py-3 rounded-xl border border-[#F0EAE0]/10 text-[#F0EAE0] placeholder:text-[#F0EAE0]/20 outline-none focus:border-[#2E7A6E]/60 transition-colors duration-150 text-sm resize-none"
                    style={{ background: 'rgba(240,234,224,0.04)' }} />
                </div>
                <button onClick={generatePlan} disabled={!ideaTitle.trim() || !ideaDesc.trim() || generating}
                  className="btn-press w-full py-3.5 font-semibold text-white rounded-xl transition-colors duration-150 disabled:opacity-30 text-sm"
                  style={{ background: '#2E7A6E' }}>
                  {generating ? 'Generando plan con IA…' : '✨ Generar mi plan de negocio'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[#F0EAE0] font-semibold">Tu plan de negocio</h2>
                  <button onClick={() => setPlan(null)} className="btn-press text-xs text-[#F0EAE0]/40 hover:text-[#C84B2F] transition-colors duration-150">Nueva idea</button>
                </div>
                {[
                  { label: 'Resumen', content: plan.resumen },
                  { label: 'Propuesta de valor', content: plan.propuestaValor },
                  { label: 'Mercado objetivo', content: plan.mercadoObjetivo },
                  { label: 'Modelo de negocio', content: plan.modeloNegocio },
                ].map(item => (
                  <div key={item.label} className="glass rounded-2xl p-5">
                    <p className="text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">{item.label}</p>
                    <p className="text-[#F0EAE0]/80 text-sm leading-relaxed">{item.content}</p>
                  </div>
                ))}
                <div className="glass rounded-2xl p-5">
                  <p className="text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-3">Hoja de ruta</p>
                  <div className="space-y-3">
                    {plan.pasos.map(paso => (
                      <div key={paso.mes} className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: 'rgba(46,122,110,0.15)', color: '#2E7A6E' }}>
                          M{paso.mes}
                        </div>
                        <div>
                          <p className="text-[#F0EAE0] font-medium text-sm">{paso.accion}</p>
                          <p className="text-[#F0EAE0]/45 text-xs mt-0.5">{paso.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass rounded-2xl p-5">
                    <p className="text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-3">Inversión inicial</p>
                    <p className="text-2xl font-bold text-[#D4920A]">S/. {plan.inversionInicial.minimo.toLocaleString()}</p>
                    <p className="text-[#F0EAE0]/40 text-xs mt-1">Mínimo · Recomendado: S/. {plan.inversionInicial.recomendado.toLocaleString()}</p>
                    <p className="text-[#F0EAE0]/60 text-sm mt-2">{plan.inversionInicial.descripcion}</p>
                  </div>
                  <div className="glass rounded-2xl p-5">
                    <p className="text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-3">Ingresos esperados</p>
                    {[['3 meses', plan.ingresoEsperado.mes3], ['6 meses', plan.ingresoEsperado.mes6], ['12 meses', plan.ingresoEsperado.mes12]].map(([label, val]) => (
                      <div key={String(label)} className="flex justify-between text-sm mb-1">
                        <span className="text-[#F0EAE0]/50">{label}</span>
                        <span className="text-[#2E7A6E] font-semibold">S/. {Number(val).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-2xl p-5">
                  <p className="text-xs text-[#F0EAE0]/40 uppercase tracking-wider mb-2">Conexión con Kuska</p>
                  <p className="text-[#F0EAE0]/70 text-sm">{plan.conexionKuska}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
