import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const existing = await prisma.groupMember.findUnique({
    where: { group_id_user_id: { group_id: params.id, user_id: session.user.id } },
  })
  if (existing) return NextResponse.json({ ok: true, alreadyMember: true })

  await prisma.groupMember.create({
    data: { group_id: params.id, user_id: session.user.id },
  })

  return NextResponse.json({ ok: true })
}
