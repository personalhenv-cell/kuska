import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOtp, normalizePeruPhone } from '@/lib/utils'
import { rateLimit } from '@/lib/rate-limit'
import { sendOtpEmail } from '@/lib/resend'

const schema = z.object({ phone: z.string().min(6) })

interface UserRow {
  id: string
  name: string
  email: string | null
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

  const users = await prisma.$queryRawUnsafe<UserRow[]>(
    `SELECT id, name, email FROM users WHERE phone = $1 LIMIT 1`,
    phone,
  )
  if (!users || users.length === 0) {
    return NextResponse.json(
      { error: 'No existe una cuenta con ese número. Regístrate primero.' },
      { status: 404 },
    )
  }
  const user = users[0]

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  await prisma.$executeRawUnsafe(
    `INSERT INTO otp_codes (id, user_id, code, expires_at, used, attempts, created_at)
     VALUES (gen_random_uuid()::text, $1, $2, $3, false, 0, NOW())`,
    user.id,
    code,
    expiresAt,
  )

  const emailResult = user.email
    ? await sendOtpEmail({ to: user.email, name: user.name, code })
    : { ok: false }

  // Decisión explícita del dueño del producto (Kuska no tiene dominio propio
  // verificado en Resend todavía, así que el email real solo llega a su
  // propia cuenta): mientras eso no se resuelva, el código se muestra
  // siempre en pantalla — igual que ya se hace en el registro — para que
  // CUALQUIER usuario pueda iniciar sesión, no solo el dueño de la cuenta
  // de Resend. Trade-off aceptado: cualquiera que conozca el teléfono de
  // otra persona podría ver su código aquí. Mitigado con el rate limit de
  // arriba (3 intentos/5min por teléfono). Revertir devolviendo `undefined`
  // en cuanto haya un dominio propio verificado y el email llegue de verdad.
  return NextResponse.json({
    ok: true,
    channel: emailResult.ok ? 'email' : 'none',
    devCode: code,
  })
}
