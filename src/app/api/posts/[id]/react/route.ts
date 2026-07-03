import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const existing = await prisma.reaction.findUnique({
    where: { post_id_user_id: { post_id: params.id, user_id: session.user.id } },
  })

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } })
    return NextResponse.json({ ok: true, reacted: false })
  }

  await prisma.reaction.create({
    data: { post_id: params.id, user_id: session.user.id, type: 'like' },
  })
  return NextResponse.json({ ok: true, reacted: true })
}
