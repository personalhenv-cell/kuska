import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ARTESANO') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const ap = await prisma.$queryRawUnsafe<Array<{
      id: string; displayName: string; bio: string | null; whatsapp: string | null
      avatarUrl: string | null; coverUrl: string | null; isVerified: boolean
      community: string | null; workshopAddress: string | null
    }>>(
      `SELECT id, "displayName", bio, whatsapp, "avatarUrl", "coverUrl", "isVerified", community, "workshopAddress"
       FROM artisan_profiles WHERE "userId" = $1 LIMIT 1`,
      session.user.id
    )

    if (!ap || ap.length === 0) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    return NextResponse.json({ data: ap[0] })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

const patchSchema = z.object({
  displayName:     z.string().min(2).max(80).optional(),
  bio:             z.string().max(500).optional(),
  whatsapp:        z.string().max(20).optional(),
  community:       z.string().max(100).optional(),
  workshopAddress: z.string().max(200).optional(),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ARTESANO') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const data = patchSchema.parse(await req.json())
    const sets: string[] = []
    const vals: unknown[] = []
    let idx = 1

    if (data.displayName     !== undefined) { sets.push(`"displayName" = $${idx++}`);     vals.push(data.displayName) }
    if (data.bio             !== undefined) { sets.push(`bio = $${idx++}`);               vals.push(data.bio) }
    if (data.whatsapp        !== undefined) { sets.push(`whatsapp = $${idx++}`);           vals.push(data.whatsapp) }
    if (data.community       !== undefined) { sets.push(`community = $${idx++}`);         vals.push(data.community) }
    if (data.workshopAddress !== undefined) { sets.push(`"workshopAddress" = $${idx++}`); vals.push(data.workshopAddress) }

    if (sets.length === 0) return NextResponse.json({ message: 'Nada que actualizar' })

    sets.push(`"updatedAt" = NOW()`)
    vals.push(session.user.id)

    await prisma.$executeRawUnsafe(
      `UPDATE artisan_profiles SET ${sets.join(', ')} WHERE "userId" = $${idx}`,
      ...vals
    )

    return NextResponse.json({ message: 'Perfil actualizado' })
  } catch (err) {
    const msg = err instanceof z.ZodError ? err.errors[0]?.message : err instanceof Error ? err.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
