'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const NicknameSchema = z.object({
  nickname: z.string().trim().max(40).optional(),
})

/**
 * Guarda el apodo del usuario — cliente o artesano, cualquier rol. El apodo
 * reemplaza el nombre real en toda la plataforma (ver auth/config.ts: se
 * mapea a `name` en el login), así que no hace falta tocar cada pantalla
 * que muestra `session.user.name`.
 */
export async function updateNickname(nickname: string): Promise<{ nickname: string | null }> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('No autorizado')
  }

  const parsed = NicknameSchema.parse({ nickname })
  const value = parsed.nickname && parsed.nickname.length > 0 ? parsed.nickname : null

  await prisma.user.update({
    where: { id: session.user.id },
    data: { nickname: value },
  })

  revalidatePath('/dashboard/cliente/perfil')
  revalidatePath('/dashboard/artesano/perfil')
  revalidatePath('/dashboard/cliente')
  revalidatePath('/dashboard/artesano')
  if (session.user.artisan_profile_id) {
    revalidatePath(`/artesano/${session.user.artisan_profile_id}`)
  }

  return { nickname: value }
}
