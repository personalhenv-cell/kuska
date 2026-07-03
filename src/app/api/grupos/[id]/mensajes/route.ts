import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { pusherServer, groupChannel } from '@/lib/pusher'

const SendSchema = z.object({ content: z.string().min(1).max(1000) })

async function assertMember(groupId: string, userId: string) {
  const membership = await prisma.groupMember.findUnique({
    where: { group_id_user_id: { group_id: groupId, user_id: userId } },
  })
  return Boolean(membership)
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  if (!(await assertMember(params.id, session.user.id))) {
    return NextResponse.json({ error: 'No eres miembro de este grupo' }, { status: 403 })
  }

  const messages = await prisma.groupMessage.findMany({
    where: { group_id: params.id },
    orderBy: { created_at: 'asc' },
    take: 200,
  })
  const senderIds = [...new Set(messages.map((m) => m.sender_id))]
  const senders = await prisma.user.findMany({ where: { id: { in: senderIds } }, select: { id: true, name: true } })
  const senderMap = new Map(senders.map((s) => [s.id, s.name]))

  return NextResponse.json({
    messages: messages.map((m) => ({ ...m, sender_name: senderMap.get(m.sender_id) ?? 'Artesano' })),
  })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  if (!(await assertMember(params.id, session.user.id))) {
    return NextResponse.json({ error: 'No eres miembro de este grupo' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const parsed = SendSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 })

  const message = await prisma.groupMessage.create({
    data: { group_id: params.id, sender_id: session.user.id, content: parsed.data.content },
  })

  const payload = { ...message, sender_name: session.user.name }
  await pusherServer.trigger(groupChannel(params.id), 'new-message', payload)

  return NextResponse.json({ ok: true, message: payload }, { status: 201 })
}
