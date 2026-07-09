import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { inboxChannel, pusherServer } from '@/lib/pusher'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const form = await req.formData()
  const socketId = form.get('socket_id')?.toString()
  const channel = form.get('channel_name')?.toString()

  if (!socketId || !channel) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  if (channel.startsWith('private-conversation-')) {
    // Solo autoriza canales de conversación que incluyan al usuario actual —
    // evita que alguien escuche una conversación ajena.
    if (!channel.includes(session.user.id)) {
      return NextResponse.json({ error: 'Canal no autorizado' }, { status: 403 })
    }
  } else if (channel.startsWith('private-inbox-')) {
    // Solo el dueño de la bandeja puede escuchar su propio canal.
    if (channel !== inboxChannel(session.user.id)) {
      return NextResponse.json({ error: 'Canal no autorizado' }, { status: 403 })
    }
  } else if (channel.startsWith('private-group-')) {
    const groupId = channel.replace('private-group-', '')
    const membership = await prisma.groupMember.findUnique({
      where: { group_id_user_id: { group_id: groupId, user_id: session.user.id } },
    })
    if (!membership) {
      return NextResponse.json({ error: 'Canal no autorizado' }, { status: 403 })
    }
  } else {
    return NextResponse.json({ error: 'Canal no autorizado' }, { status: 403 })
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channel)
  return NextResponse.json(authResponse)
}
