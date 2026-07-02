import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { getPlan } from '@/lib/memberships'

const SubscribeSchema = z.object({
  plan: z.enum(['semilla', 'pro', 'maestro', 'explorador', 'coleccionista']),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const parsed = SubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Plan inválido' }, { status: 400 })
  }

  const plan = getPlan(parsed.data.plan)
  if (!plan) {
    return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
  }
  if (plan.role !== session.user.role) {
    return NextResponse.json(
      { error: `El plan ${plan.name} es para cuentas de ${plan.role}` },
      { status: 403 },
    )
  }

  // Pago SIMULADO — se activa de inmediato, sin pasarela real.
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  await prisma.$transaction(async (tx) => {
    if (plan.role === 'artesano') {
      if (!session.user.artisan_profile_id) throw new Error('Perfil de artesano no encontrado')
      await tx.artisanProfile.update({
        where: { id: session.user.artisan_profile_id },
        data: { membership_tier: plan.id },
      })
    } else {
      await tx.clientProfile.update({
        where: { user_id: session.user.id },
        data: { membership_tier: plan.id },
      })
    }

    if (plan.price > 0) {
      await tx.subscription.create({
        data: {
          user_id: session.user.id,
          plan: plan.id,
          role: plan.role,
          status: 'active',
          price: plan.price,
          expires_at: expiresAt,
        },
      })
    }
  })

  return NextResponse.json({ ok: true, plan: plan.id })
}
