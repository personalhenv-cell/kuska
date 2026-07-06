import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const CreateWorkshopSchema = z
  .object({
    title: z.string().min(4).max(120),
    description: z.string().min(10).max(2000),
    date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'Fecha inválida'),
    capacity: z.number().int().min(1).max(500),
    price: z.number().min(0).max(10000).default(0),
    is_virtual: z.boolean().default(true),
    location: z.string().min(4).max(300).optional().or(z.literal('')),
    meeting_url: z.string().url().max(500).optional().or(z.literal('')),
    materials_url: z.string().url().max(500).optional().or(z.literal('')),
  })
  .refine((d) => d.is_virtual || (d.location && d.location.length >= 4), {
    message: 'Los talleres presenciales necesitan una dirección real',
    path: ['location'],
  })

/** GET /api/talleres — lista los talleres próximos (fecha futura), datos reales. */
export async function GET() {
  const workshops = await prisma.workshop.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    include: {
      artisan: { select: { id: true, specialty: true, region: true, user: { select: { name: true } } } },
      _count: { select: { participants: true } },
    },
  })

  return NextResponse.json({ workshops })
}

/** POST /api/talleres — un artesano crea un taller propio. */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = CreateWorkshopSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const d = parsed.data
  const workshop = await prisma.workshop.create({
    data: {
      artisan_id: session.user.artisan_profile_id,
      title: d.title,
      description: d.description,
      date: new Date(d.date),
      capacity: d.capacity,
      price: d.price,
      is_virtual: d.is_virtual,
      location: d.is_virtual ? null : d.location || null,
      meeting_url: d.is_virtual ? d.meeting_url || null : null,
      materials_url: d.materials_url || null,
    },
  })

  return NextResponse.json({ workshop }, { status: 201 })
}
