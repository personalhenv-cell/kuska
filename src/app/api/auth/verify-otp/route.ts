import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { normalizePeruPhone } from '@/lib/utils'

const schema = z.object({
  phone: z.string().min(6),
  code: z.string().length(6),
})

interface CountRow {
  count: bigint
}

/**
 * Verifica (sin consumir) que un OTP sea válido. Útil para feedback de UI antes
 * de llamar a `signIn`. El consumo real del OTP ocurre en NextAuth `authorize`.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }

  const phone = normalizePeruPhone(parsed.data.phone)
  if (!phone) return NextResponse.json({ valid: false }, { status: 400 })

  const rows = await prisma.$queryRawUnsafe<CountRow[]>(
    `SELECT COUNT(*)::bigint AS count
     FROM otp_codes o
     JOIN users u ON u.id = o.user_id
     WHERE u.phone = $1
       AND o.code = $2
       AND o.expires_at > NOW()
       AND o.used = false`,
    phone,
    parsed.data.code,
  )

  const valid = rows.length > 0 && rows[0].count > 0n
  return NextResponse.json({ valid })
}
