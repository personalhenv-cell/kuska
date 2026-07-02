'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ChatWindow } from './ChatWindow'
import { Kusi } from '@/components/ui/Kusi'

interface Conversation {
  user: { id: string; name: string; avatar_url: string | null }
  lastMessage: string
  lastAt: string
  unread: number
}

export function Inbox({ currentUserId, basePath }: { currentUserId: string; basePath: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('with')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/messages/conversations')
      .then((res) => res.json())
      .then((data: { conversations?: Conversation[] }) => setConversations(data.conversations ?? []))
      .finally(() => setLoading(false))
  }, [])

  const selected = conversations.find((c) => c.user.id === selectedId)
  const selectedName = selected?.user.name ?? (selectedId ? 'Conversación' : undefined)

  return (
    <div className="grid h-[calc(100vh-3rem)] gap-4 lg:grid-cols-[300px_1fr]">
      <aside className="overflow-y-auto rounded-glass border border-kuska-border bg-white">
        {loading && (
          <div className="flex justify-center py-10">
            <Kusi size="sm" animation="think" />
          </div>
        )}
        {!loading && conversations.length === 0 && (
          <p className="p-5 text-center font-body text-sm text-kuska-text-mid">
            Aún no tienes conversaciones.
          </p>
        )}
        {conversations.map((c) => (
          <button
            key={c.user.id}
            onClick={() => router.push(`${basePath}?with=${c.user.id}`)}
            className={`flex w-full items-center gap-3 border-b border-kuska-border p-4 text-left transition-colors hover:bg-kuska-cream ${
              selectedId === c.user.id ? 'bg-kuska-cream' : ''
            }`}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-kuska-teal/20">
              {c.user.avatar_url ? (
                <Image src={c.user.avatar_url} alt={c.user.name} width={40} height={40} className="rounded-full object-cover" />
              ) : (
                <span className="font-display font-bold text-kuska-teal">{c.user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-body text-sm font-semibold text-kuska-text">{c.user.name}</p>
              <p className="truncate font-body text-xs text-kuska-text-mid">{c.lastMessage}</p>
            </div>
            {c.unread > 0 && (
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-kuska-red font-nunito text-[10px] font-bold text-white">
                {c.unread}
              </span>
            )}
          </button>
        ))}
      </aside>

      <div className="min-h-0">
        {selectedId && selectedName ? (
          <ChatWindow currentUserId={currentUserId} otherUserId={selectedId} otherUserName={selectedName} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-glass border border-kuska-border bg-white text-center">
            <Kusi size="md" animation="idle" />
            <p className="font-body text-sm text-kuska-text-mid">Elige una conversación para empezar a chatear.</p>
          </div>
        )}
      </div>
    </div>
  )
}
