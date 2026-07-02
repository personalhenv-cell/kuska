'use client'

import { useEffect, useRef, useState } from 'react'
import { getPusherClient } from '@/lib/pusher-client'
import { Kusi } from '@/components/ui/Kusi'
import { formatDate } from '@/lib/utils'

interface ChatMessage {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  is_kusi_bot: boolean
  created_at: string
}

interface ChatWindowProps {
  currentUserId: string
  otherUserId: string
  otherUserName: string
}

function dedupeAppend(prev: ChatMessage[], msg: ChatMessage): ChatMessage[] {
  if (prev.some((m) => m.id === msg.id)) return prev
  return [...prev, msg]
}

export function ChatWindow({ currentUserId, otherUserId, otherUserName }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string>()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/messages?with=${otherUserId}`)
      .then((res) => res.json())
      .then((data: { messages?: ChatMessage[] }) => {
        if (!cancelled) setMessages(data.messages ?? [])
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [otherUserId])

  useEffect(() => {
    const [a, b] = [currentUserId, otherUserId].sort()
    const channelName = `private-conversation-${a}-${b}`
    const pusher = getPusherClient()
    const channel = pusher.subscribe(channelName)
    channel.bind('new-message', (msg: ChatMessage) => {
      setMessages((prev) => dedupeAppend(prev, msg))
    })
    return () => {
      channel.unbind('new-message')
      pusher.unsubscribe(channelName)
    }
  }, [currentUserId, otherUserId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const content = input.trim()
    if (!content || sending) return
    setSending(true)
    setError(undefined)
    setInput('')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver_id: otherUserId, content }),
      })
      const data: { message?: ChatMessage; error?: string } = await res.json()
      if (!res.ok || !data.message) {
        setError(data.error ?? 'No se pudo enviar el mensaje')
        return
      }
      setMessages((prev) => dedupeAppend(prev, data.message!))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-glass border border-kuska-border bg-white">
      <div className="border-b border-kuska-border px-5 py-3">
        <p className="font-display font-bold text-kuska-text">{otherUserName}</p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
        {loading && (
          <div className="flex justify-center py-10">
            <Kusi size="sm" animation="think" />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <p className="py-10 text-center font-body text-sm text-kuska-text-mid">
            Aún no hay mensajes. ¡Escribe el primero!
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === currentUserId
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${
                  mine ? 'bg-kuska-brown text-kuska-cream' : 'border border-kuska-border bg-kuska-cream text-kuska-text'
                }`}
              >
                <p>{m.content}</p>
                <p className={`mt-1 font-nunito text-[10px] ${mine ? 'text-kuska-cream/50' : 'text-kuska-text-mid'}`}>
                  {formatDate(m.created_at)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {error && <p className="px-5 font-body text-xs text-kuska-red">{error}</p>}

      <form onSubmit={send} className="flex gap-2 border-t border-kuska-border p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje…"
          className="flex-1 rounded-btn border border-kuska-border px-4 py-2.5 font-body text-sm focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-btn bg-kuska-red px-5 py-2.5 font-body text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}
