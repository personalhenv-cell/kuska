import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { normalizePeruPhone, generateOtp } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(6),
  specialty: z.string().min(2),
  technique: z.string().min(2),
  region: z.string().min(2),
  community: z.string().min(2),
  years_experience: z.number().int().min(0).max(80).default(0),
  story: z.string().optional(),
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

  const { name, specialty, technique, region, community, years_experience, story } = parsed.data

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      role: 'artesano',
      artisan_profile: {
        create: { specialty, technique, region, community, years_experience, story },
      },
    },
    include: { artisan_profile: true },
  })

  // Generar OTP de bienvenida
  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
  await prisma.$executeRawUnsafe(
    `INSERT INTO otp_codes (id, user_id, code, expires_at, used, attempts, created_at)
     VALUES (gen_random_uuid()::text, $1, $2, $3, false, 0, NOW())`,
    user.id,
    code,
    expiresAt,
  )

  const isDev = process.env.NODE_ENV !== 'production'
  return NextResponse.json({
    ok: true,
    userId: user.id,
    devCode: isDev ? code : undefined,
  }, { status: 201 })
}
