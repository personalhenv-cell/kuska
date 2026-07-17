import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const InscribirSchema = z.object({
  payment_method: z.enum(['yape', 'plin', 'visa']).optional(),
})

/** POST /api/talleres/[id]/inscribir — inscribe al usuario en sesión (con cupo). */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Inicia sesión para inscribirte' }, { status: 401 })
  }

  let body: unknown = {}
  try {
    body = await req.json()
  } catch {
    // Sin body es válido — talleres gratuitos no envían payment_method.
  }
  const parsed = InscribirSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Método de pago inválido' }, { status: 400 })
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
  if (workshop.price > 0 && !parsed.data.payment_method) {
    return NextResponse.json({ error: 'Selecciona un método de pago' }, { status: 400 })
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

  try {
    // @@unique([workshop_id, user_id]) hace el chequeo-y-registro atómico a
    // nivel de fila: si el mismo usuario dispara dos inscripciones
    // simultáneas (doble clic), Postgres rechaza la segunda en vez de
    // duplicarlo como participante.
    await prisma.workshopParticipant.create({
      data: {
        workshop_id: workshop.id,
        user_id: session.user.id,
        // Pago SIMULADO: se marca como pagado de inmediato, no hay pasarela real.
        payment_method: parsed.data.payment_method ?? null,
        payment_status: workshop.price > 0 ? 'pagado' : 'no_aplica',
      },
    })
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Ya estás inscrito en este taller', alreadyEnrolled: true }, { status: 409 })
    }
    throw e
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
