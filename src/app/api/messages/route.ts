import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { pusherServer, conversationChannel } from '@/lib/pusher'

const SendSchema = z.object({
  receiver_id: z.string().min(1),
  content: z.string().min(1).max(2000),
})

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const withUserId = searchParams.get('with')
  if (!withUserId) return NextResponse.json({ error: 'Falta el parámetro with' }, { status: 400 })

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { sender_id: session.user.id, receiver_id: withUserId },
        { sender_id: withUserId, receiver_id: session.user.id },
      ],
    },
    orderBy: { created_at: 'asc' },
    take: 100,
  })

  // Marca como leídos los mensajes que me enviaron.
  await prisma.message.updateMany({
    where: { sender_id: withUserId, receiver_id: session.user.id, is_read: false },
    data: { is_read: true },
  })

  return NextResponse.json({ messages })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const parsed = SendSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 })
  }
  const { receiver_id, content } = parsed.data
  if (receiver_id === session.user.id) {
    return NextResponse.json({ error: 'No puedes enviarte un mensaje a ti mismo' }, { status: 400 })
  }

  const receiver = await prisma.user.findUnique({ where: { id: receiver_id }, select: { id: true } })
  if (!receiver) return NextResponse.json({ error: 'Destinatario no encontrado' }, { status: 404 })

  const message = await prisma.message.create({
    data: { sender_id: session.user.id, receiver_id, content },
  })

  await pusherServer.trigger(
    conversationChannel(session.user.id, receiver_id),
    'new-message',
    message,
  )

  return NextResponse.json({ ok: true, message })
}
