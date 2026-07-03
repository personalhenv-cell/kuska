import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const SaveSchema = z.object({
  title: z.string().min(2).max(120),
  content: z.string().min(10),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const plans = await prisma.businessPlan.findMany({
    where: { user_id: session.user.id },
    orderBy: { created_at: 'desc' },
  })
  return NextResponse.json({ plans })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente' || !session.user.is_entrepreneur) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const parsed = SaveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const plan = await prisma.businessPlan.create({
    data: {
      user_id: session.user.id,
      title: parsed.data.title,
      data: { content: parsed.data.content },
    },
  })

  return NextResponse.json({ ok: true, plan }, { status: 201 })
}
