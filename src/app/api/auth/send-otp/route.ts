import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOtp, normalizePeruPhone } from '@/lib/utils'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({ phone: z.string().min(6) })

interface UserIdRow {
  id: string
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const phone = normalizePeruPhone(parsed.data.phone)
  if (!phone) {
    return NextResponse.json(
      { error: 'Número peruano inválido' },
      { status: 400 },
    )
  }

  // Rate limit: 3 intentos por número cada 5 minutos.
  const limit = rateLimit(`otp:${phone}`, 3, 5 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: 'Demasiados intentos. Espera unos minutos.',
        retryAfterSeconds: Math.ceil(limit.retryAfterMs / 1000),
      },
      { status: 429 },
    )
  }

  const users = await prisma.$queryRawUnsafe<UserIdRow[]>(
    `SELECT id FROM users WHERE phone = $1 LIMIT 1`,
    phone,
  )
  if (!users || users.length === 0) {
    return NextResponse.json(
      { error: 'No existe una cuenta con ese número. Regístrate primero.' },
      { status: 404 },
    )
  }

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  await prisma.$executeRawUnsafe(
    `INSERT INTO otp_codes (id, user_id, code, expires_at, used, attempts, created_at)
     VALUES (gen_random_uuid()::text, $1, $2, $3, false, 0, NOW())`,
    users[0].id,
    code,
    expiresAt,
  )

  // TODO(fase-10): enviar el OTP por SMS/WhatsApp/Email (Resend).
  // En desarrollo se devuelve en la respuesta para mostrarlo en pantalla.
  const isDev = process.env.NODE_ENV !== 'production'
  return NextResponse.json({ ok: true, devCode: isDev ? code : undefined })
}
