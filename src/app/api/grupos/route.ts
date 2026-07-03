import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const CreateGroupSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  region: z.string().max(80).optional(),
  fair_date: z.string().optional(),
  fair_location: z.string().max(150).optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const groups = await prisma.artisanGroup.findMany({
    orderBy: { created_at: 'desc' },
    include: { _count: { select: { members: true } } },
  })

  return NextResponse.json({ groups })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = CreateGroupSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

  const group = await prisma.artisanGroup.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      creator_id: session.user.id,
      region: parsed.data.region,
      fair_date: parsed.data.fair_date ? new Date(parsed.data.fair_date) : undefined,
      fair_location: parsed.data.fair_location,
      members: { create: { user_id: session.user.id, role: 'admin' } },
    },
  })

  return NextResponse.json({ ok: true, group }, { status: 201 })
}
