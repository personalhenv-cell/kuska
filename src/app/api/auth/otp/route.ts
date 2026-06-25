import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const schema = z.object({
  phone: z.string().regex(/^9\d{8}$/, 'Número peruano inválido'),
})

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const body      = await req.json()
    const { phone } = schema.parse(body)
    const fullPhone = `+51${phone}`
    const otp       = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Buscar o crear usuario
    let user = await prisma.user.findUnique({ where: { phone: fullPhone } })
    if (!user) {
      user = await prisma.user.create({
        data: { phone: fullPhone, role: 'CLIENTE' },
      })
    }

    // Eliminar OTPs anteriores usando SQL raw para evitar problemas de FK
    await prisma.$executeRawUnsafe(
      `DELETE FROM sessions WHERE "userId" = $1`,
      user.id
    )

    // Crear nuevo OTP usando SQL raw
    await prisma.$executeRawUnsafe(
      `INSERT INTO sessions (id, "userId", token, "expiresAt", "createdAt") 
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      user.id,
      otp,
      expiresAt
    )

    console.log(`OTP para ${fullPhone}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: 'Código enviado',
      otp, // Siempre visible en desarrollo
    })
  } catch (error) {
    console.error('OTP error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 422 })
    }
    return NextResponse.json({ 
      error: 'Error al enviar OTP',
      detail: String(error)
    }, { status: 500 })
  }
}
