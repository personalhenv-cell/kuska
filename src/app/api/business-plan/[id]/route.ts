import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string }
}

export async function GET(_req: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const plan = await prisma.businessPlan.findUnique({ where: { id: params.id } })
  if (!plan || plan.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
  }
  return NextResponse.json({ plan })
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const plan = await prisma.businessPlan.findUnique({ where: { id: params.id } })
  if (!plan || plan.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
  }

  await prisma.businessPlan.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
