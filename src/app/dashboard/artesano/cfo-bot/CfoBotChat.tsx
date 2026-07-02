'use client'

import { useEffect, useRef, useState } from 'react'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  '¿Cómo van mis ventas este mes?',
  '¿Qué productos debería impulsar?',
  '¿Tengo alguna alerta de stock?',
]

export function CfoBotChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hola, soy tu CFO-Bot 🤖 Pregúntame sobre tus ventas, stock o qué productos priorizar — reviso los datos reales de tu taller.',
    },
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string>()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    if (!text.trim() || streaming) return
    setError(undefined)
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages([...nextMessages, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)

    try {
      const res = await fetch('/api/ai/cfo-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      if (!res.ok || !res.body) {
        const data: { error?: string } = await res.json().catch(() => ({}))
        setError(data.error ?? 'No se pudo conectar con el CFO-Bot')
        setMessages(nextMessages)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages([...nextMessages, { role: 'assistant', content: acc }])
      }
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-glass border border-kuska-border bg-white">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.role === 'assistant' && (
              <div className="flex-shrink-0">
                <Kusi size="xs" animation="idle" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-kuska-brown text-kuska-cream'
                  : 'border border-kuska-border bg-kuska-cream text-kuska-text'
              }`}
            >
              {m.content || (streaming && i === messages.length - 1 ? '…' : '')}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="px-6 font-body text-sm text-kuska-red">{error}</p>}

      <div className="border-t border-kuska-border p-4">
        {messages.length <= 1 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-kuska-border px-3 py-1.5 font-body text-xs text-kuska-text-mid transition-colors hover:border-kuska-gold hover:text-kuska-text"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntale al CFO-Bot…"
            disabled={streaming}
            className="flex-1 rounded-btn border border-kuska-border px-4 py-2.5 font-body text-sm focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
          />
          <Button type="submit" disabled={streaming || !input.trim()}>
            {streaming ? 'Pensando…' : 'Enviar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
