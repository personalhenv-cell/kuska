import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/** POST /api/talleres/[id]/inscribir — inscribe al usuario en sesión (con cupo). */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Inicia sesión para inscribirte' }, { status: 401 })
  }

  const workshop = await prisma.workshop.findUnique({
    where: { id: params.id },
    include: { _count: { select: { participants: true } } },
  })
  if (!workshop) {
    return NextResponse.json({ error: 'Taller no encontrado' }, { status: 404 })
  }
  if (workshop.date < new Date()) {
    return NextResponse.json({ error: 'Este taller ya ocurrió' }, { status: 409 })
  }

  const already = await prisma.workshopParticipant.findFirst({
    where: { workshop_id: workshop.id, user_id: session.user.id },
    select: { id: true },
  })
  if (already) {
    return NextResponse.json({ error: 'Ya estás inscrito en este taller', alreadyEnrolled: true }, { status: 409 })
  }

  if (workshop._count.participants >= workshop.capacity) {
    return NextResponse.json({ error: 'El taller ya está lleno' }, { status: 409 })
  }

  await prisma.workshopParticipant.create({
    data: { workshop_id: workshop.id, user_id: session.user.id },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
