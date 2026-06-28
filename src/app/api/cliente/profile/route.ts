import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const cp = await prisma.$queryRawUnsafe<Array<{ id: string; displayName: string; avatarUrl: string | null }>>(
      `SELECT id, "displayName", "avatarUrl" FROM client_profiles WHERE "userId" = $1 LIMIT 1`,
      session.user.id
    )
    if (!cp || cp.length === 0) return NextResponse.json({ data: null })
    return NextResponse.json({ data: cp[0] })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

const patchSchema = z.object({ displayName: z.string().min(2).max(80) })

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { displayName } = patchSchema.parse(await req.json())

    const existing = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT id FROM client_profiles WHERE "userId" = $1 LIMIT 1`, session.user.id
    )
    if (!existing || existing.length === 0) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO client_profiles (id, "userId", "displayName", "createdAt")
         VALUES (gen_random_uuid()::text, $1, $2, NOW())`,
        session.user.id, displayName
      )
    } else {
      await prisma.$executeRawUnsafe(
        `UPDATE client_profiles SET "displayName" = $1 WHERE "userId" = $2`,
        displayName, session.user.id
      )
    }

    return NextResponse.json({ message: 'Perfil actualizado' })
  } catch (err) {
    const msg = err instanceof z.ZodError ? err.errors[0]?.message : err instanceof Error ? err.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
