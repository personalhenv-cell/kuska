import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { normalizePeruPhone, generateOtp } from '@/lib/utils'
import { sendWelcomeEmail, sendOtpEmail } from '@/lib/resend'

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(6),
  email: z.string().email(),
  specialty: z.string().min(2),
  technique: z.string().min(2),
  region: z.string().min(2),
  community: z.string().trim().max(120).optional(),
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

  const existing = await prisma.user.findFirst({ where: { OR: [{ phone }, { email: parsed.data.email }] } })
  if (existing) {
    return NextResponse.json({ error: 'Ya existe una cuenta con ese número o correo' }, { status: 409 })
  }

  const { name, email, specialty, technique, region, community, years_experience, story } = parsed.data

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      email,
      role: 'artesano',
      artisan_profile: {
        create: { specialty, technique, region, community: community || '', years_experience, story },
      },
    },
    include: { artisan_profile: true },
  })

  // Generar OTP de verificación
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
  const otpResult = await sendOtpEmail({ to: user.email!, name: user.name, code })
  await sendWelcomeEmail({ to: user.email, name: user.name, role: 'artesano' })

  // El código siempre se devuelve: Resend está en modo de prueba (solo
  // entrega a la cuenta propia del remitente) hasta verificar un dominio
  // propio, así que mostrarlo en pantalla es el canal de entrega real hoy.
  return NextResponse.json({
    ok: true,
    userId: user.id,
    otpSent: otpResult.ok,
    devCode: code,
  }, { status: 201 })
}
