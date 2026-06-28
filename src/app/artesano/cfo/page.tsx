'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Message { role: 'user' | 'assistant'; content: string; ts: number }

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5"
          style={{ background: 'rgba(46,122,110,0.2)', color: '#2E7A6E' }}>
          🤖
        </div>
      )}
      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'text-white rounded-br-sm'
          : 'text-[#F0EAE0]/85 border border-[#F0EAE0]/[0.07] rounded-bl-sm'
      }`}
        style={isUser ? { background: '#C84B2F' } : { background: 'rgba(240,234,224,0.04)' }}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</span>
        ))}
      </div>
    </motion.div>
  )
}

const SUGGESTIONS = [
  '¿Cuánto gané este mes?',
  'Analiza mis gastos',
  'Consejos para subir mis ventas',
  'Cómo declarar mis impuestos',
]

export default function CfoPage() {
  const [messages,       setMessages]       = useState<Message[]>([])
  const [input,          setInput]          = useState('')
  const [loading,        setLoading]        = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content, ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res  = await fetch('/api/cfo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, conversationId }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Error'); return }

      setMessages(prev => [...prev, { role: 'assistant', content: data.message, ts: Date.now() }])
      if (data.conversationId) setConversationId(data.conversationId)
    } catch { toast.error('Error de conexión')
    } finally { setLoading(false) }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
          style={{ background: 'rgba(46,122,110,0.15)' }}>🤖</div>
        <div>
          <h1 className="text-lg font-bold text-[#F0EAE0]" style={{ fontFamily: 'Playfair Display, serif' }}>CFO-Bot IA</h1>
          <p className="text-[#F0EAE0]/40 text-xs">Tu asesor financiero personal · Powered by Claude</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2E7A6E]" />
          <span className="text-[#2E7A6E] text-xs">En línea</span>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 mb-4">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="text-center py-12">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-[#F0EAE0]/60 font-medium mb-2">¿En qué te puedo ayudar hoy?</h2>
            <p className="text-[#F0EAE0]/30 text-sm mb-8">Pregúntame sobre tus finanzas, ventas o estrategia de negocio.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="btn-press text-sm px-4 py-2 rounded-full glass border border-[#F0EAE0]/10 text-[#F0EAE0]/55 hover:text-[#F0EAE0] transition-colors duration-150">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex justify-start mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 mt-0.5"
                style={{ background: 'rgba(46,122,110,0.2)' }}>🤖</div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm border border-[#F0EAE0]/[0.07]"
                style={{ background: 'rgba(240,234,224,0.04)' }}>
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 0.15, 0.3].map(d => (
                    <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-[#F0EAE0]/40"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: d }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 flex gap-3 items-end glass rounded-2xl border border-[#F0EAE0]/10 p-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Escribe tu pregunta… (Enter para enviar)"
          rows={1}
          className="flex-1 bg-transparent text-[#F0EAE0] placeholder:text-[#F0EAE0]/25 outline-none resize-none text-sm leading-relaxed"
          style={{ maxHeight: '120px' }}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading}
          className="btn-press w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-150 disabled:opacity-30 flex-shrink-0"
          style={{ background: '#C84B2F' }}>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  )
}
