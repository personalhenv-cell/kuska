'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getPusherClient } from '@/lib/pusher-client'
import { Kusi } from '@/components/ui/Kusi'
import { formatDate } from '@/lib/utils'

interface GroupMessageItem {
  id: string
  sender_id: string
  sender_name: string
  content: string
  created_at: string
}

function dedupeAppend(prev: GroupMessageItem[], msg: GroupMessageItem): GroupMessageItem[] {
  if (prev.some((m) => m.id === msg.id)) return prev
  return [...prev, msg]
}

export function GroupChat({ groupId }: { groupId: string }) {
  const { data: authSession } = useSession()
  const [messages, setMessages] = useState<GroupMessageItem[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/grupos/${groupId}/mensajes`)
      .then((res) => res.json())
      .then((data: { messages?: GroupMessageItem[] }) => {
        if (!cancelled) setMessages(data.messages ?? [])
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [groupId])

  useEffect(() => {
    const channelName = `private-group-${groupId}`
    const pusher = getPusherClient()
    const channel = pusher.subscribe(channelName)
    channel.bind('new-message', (msg: GroupMessageItem) => {
      setMessages((prev) => dedupeAppend(prev, msg))
    })
    return () => {
      channel.unbind('new-message')
      pusher.unsubscribe(channelName)
    }
  }, [groupId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const content = input.trim()
    if (!content || sending) return
    setSending(true)
    setInput('')
    try {
      const res = await fetch(`/api/grupos/${groupId}/mensajes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data: { message?: GroupMessageItem } = await res.json()
      if (data.message) setMessages((prev) => dedupeAppend(prev, data.message!))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-glass border border-kuska-border bg-white">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
        {loading && (
          <div className="flex justify-center py-10">
            <Kusi size="sm" animation="think" />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <p className="py-10 text-center font-body text-sm text-kuska-text-mid">
            Aún no hay mensajes en este grupo. ¡Escribe el primero!
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === authSession?.user.id
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${
                  mine ? 'bg-kuska-brown text-kuska-cream' : 'border border-kuska-border bg-kuska-cream text-kuska-text'
                }`}
              >
                {!mine && <p className="mb-0.5 font-nunito text-[11px] font-bold text-kuska-teal">{m.sender_name}</p>}
                <p>{m.content}</p>
                <p className={`mt-1 font-nunito text-[10px] ${mine ? 'text-kuska-cream/50' : 'text-kuska-text-mid'}`}>
                  {formatDate(m.created_at)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-kuska-border p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje al grupo…"
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
