import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { pusherServer } from '@/lib/pusher'

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

  // Solo autoriza canales de conversación que incluyan al usuario actual —
  // evita que alguien escuche una conversación ajena.
  if (!channel.startsWith('private-conversation-') || !channel.includes(session.user.id)) {
    return NextResponse.json({ error: 'Canal no autorizado' }, { status: 403 })
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channel)
  return NextResponse.json(authResponse)
}
