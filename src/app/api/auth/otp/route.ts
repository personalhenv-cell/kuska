import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const schema = z.object({ phone: z.string().min(9).max(9) })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { phone } = schema.parse(body)
    const fullPhone = `+51${phone}`

    let users = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT id FROM users WHERE phone = $1 LIMIT 1`,
      fullPhone
    )
    if (!users || users.length === 0) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO users (id, phone, role, "preferredLang", "isActive", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, 'CLIENTE', 'es', true, NOW(), NOW())`,
        fullPhone
      )
      users = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `SELECT id FROM users WHERE phone = $1 LIMIT 1`,
        fullPhone
      )
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.$executeRawUnsafe(
      `DELETE FROM sessions WHERE "userId" = $1 AND "expiresAt" < NOW()`,
      users[0].id
    )
    await prisma.$executeRawUnsafe(
      `INSERT INTO sessions (id, "userId", token, "expiresAt", "createdAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, NOW())`,
      users[0].id, otp, expiresAt
    )

    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ message: 'OTP enviado', otp })
    }
    // In production, send via Twilio/SMS here
    return NextResponse.json({ message: 'OTP enviado' })
  } catch (err) {
    const msg = err instanceof z.ZodError ? err.errors[0]?.message : err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
