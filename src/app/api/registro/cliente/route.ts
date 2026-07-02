import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { normalizePeruPhone, generateOtp } from '@/lib/utils'
import { sendWelcomeEmail } from '@/lib/resend'

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(6),
  interests: z.array(z.string()).default([]),
  regions_interest: z.array(z.string()).default([]),
  is_entrepreneur: z.boolean().default(false),
  business_name: z.string().optional(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const phone = normalizePeruPhone(parsed.data.phone)
  if (!phone) {
    return NextResponse.json({ error: 'Número peruano inválido' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { phone } })
  if (existing) {
    return NextResponse.json({ error: 'Ya existe una cuenta con ese número' }, { status: 409 })
  }

  const { name, interests, regions_interest, is_entrepreneur, business_name } = parsed.data

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      role: 'cliente',
      client_profile: { create: { interests, regions_interest, is_entrepreneur, business_name } },
    },
  })

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
  await prisma.$executeRawUnsafe(
    `INSERT INTO otp_codes (id, user_id, code, expires_at, used, attempts, created_at)
     VALUES (gen_random_uuid()::text, $1, $2, $3, false, 0, NOW())`,
    user.id,
    code,
    expiresAt,
  )

  // await (no fire-and-forget): en serverless (Vercel) una promesa sin
  // esperar puede quedar truncada al terminar la función antes de enviarse.
  await sendWelcomeEmail({ to: user.email, name: user.name, role: 'cliente' })

  const isDev = process.env.NODE_ENV !== 'production'
  return NextResponse.json({ ok: true, userId: user.id, devCode: isDev ? code : undefined }, { status: 201 })
}
