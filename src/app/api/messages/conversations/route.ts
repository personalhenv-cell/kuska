import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const messages = await prisma.message.findMany({
    where: { OR: [{ sender_id: session.user.id }, { receiver_id: session.user.id }] },
    orderBy: { created_at: 'desc' },
    include: {
      sender: { select: { id: true, name: true, avatar_url: true } },
      receiver: { select: { id: true, name: true, avatar_url: true } },
    },
  })

  // Agrupa por el "otro" usuario de la conversación, quedándose con el
  // mensaje más reciente y contando los no leídos que me enviaron.
  const byUser = new Map<
    string,
    { user: { id: string; name: string; avatar_url: string | null }; lastMessage: string; lastAt: Date; unread: number }
  >()

  for (const m of messages) {
    const isMine = m.sender_id === session.user.id
    const other = isMine ? m.receiver : m.sender
    const existing = byUser.get(other.id)
    if (!existing) {
      byUser.set(other.id, {
        user: other,
        lastMessage: m.content,
        lastAt: m.created_at,
        unread: !isMine && !m.is_read ? 1 : 0,
      })
    } else if (!isMine && !m.is_read) {
      existing.unread += 1
    }
  }

  const conversations = Array.from(byUser.values()).sort(
    (a, b) => b.lastAt.getTime() - a.lastAt.getTime(),
  )

  return NextResponse.json({ conversations })
}
