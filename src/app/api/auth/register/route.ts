import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const schema = z.object({
  phone:       z.string().length(9),
  role:        z.enum(['ARTESANO', 'CLIENTE']),
  displayName: z.string().min(2).max(80),
  email:       z.string().email().optional(),
  regionId:    z.string().optional(),
  bio:         z.string().max(500).optional(),
})

export async function POST(req: Request) {
  try {
    const data  = schema.parse(await req.json())
    const phone = `+51${data.phone}`

    const existing = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT id FROM users WHERE phone = $1 LIMIT 1`, phone
    )

    let userId: string

    if (existing && existing.length > 0) {
      userId = existing[0].id
      await prisma.$executeRawUnsafe(
        `UPDATE users SET role = $1, "updatedAt" = NOW() WHERE id = $2`,
        data.role, userId
      )
    } else {
      await prisma.$executeRawUnsafe(
        `INSERT INTO users (id, phone, role, "preferredLang", "isActive", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, 'es', true, NOW(), NOW())`,
        phone, data.role
      )
      const row = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `SELECT id FROM users WHERE phone = $1 LIMIT 1`, phone
      )
      userId = row[0].id
    }

    if (data.role === 'ARTESANO') {
      const ap = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `SELECT id FROM artisan_profiles WHERE "userId" = $1 LIMIT 1`, userId
      )
      if (!ap || ap.length === 0) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO artisan_profiles (id, "userId", "displayName", bio, "regionId", "isVerified", "totalSales", "avgRating", "createdAt", "updatedAt")
           VALUES (gen_random_uuid()::text, $1, $2, $3, $4, false, 0, 0, NOW(), NOW())`,
          userId, data.displayName, data.bio ?? null, data.regionId ?? null
        )
        await prisma.$executeRawUnsafe(
          `INSERT INTO credit_scores (id, "artisanId", score, tier, "salesCount", "salesTotal", "reputationAvg", "activityDays", "lastCalculated", "updatedAt")
           SELECT gen_random_uuid()::text, id, 0, 'BRONCE', 0, 0, 0, 0, NOW(), NOW()
           FROM artisan_profiles WHERE "userId" = $1
           ON CONFLICT ("artisanId") DO NOTHING`, userId
        )
        await prisma.$executeRawUnsafe(
          `INSERT INTO memberships (id, "artisanId", plan, "isActive", "startsAt", amount)
           SELECT gen_random_uuid()::text, id, 'BASIC', true, NOW(), 10
           FROM artisan_profiles WHERE "userId" = $1
           ON CONFLICT ("artisanId") DO NOTHING`, userId
        )
      }
    } else {
      const cp = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `SELECT id FROM client_profiles WHERE "userId" = $1 LIMIT 1`, userId
      )
      if (!cp || cp.length === 0) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO client_profiles (id, "userId", "displayName", "createdAt")
           VALUES (gen_random_uuid()::text, $1, $2, NOW())`,
          userId, data.displayName
        )
      }
    }

    return NextResponse.json({ message: 'Registro exitoso', userId })
  } catch (err) {
    const msg = err instanceof z.ZodError ? err.errors[0]?.message : err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
