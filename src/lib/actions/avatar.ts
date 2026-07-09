'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const AvatarSchema = z.object({
  avatarUrl: z
    .string()
    .url()
    .max(600)
    .refine((url) => url.startsWith('https://'), 'La URL de la imagen debe ser segura (https)'),
})

/**
 * Actualiza `users.avatar_url` para el usuario autenticado — cliente o
 * artesano, cualquier rol. Se llama justo después de subir la foto a Vercel
 * Blob desde <AvatarUploader>. Como todas las pantallas de la plataforma
 * (header, tarjetas de producto/artesano, reseñas, comentarios, chat) leen
 * `avatar_url` directamente de la tabla `users` vía Prisma, el cambio se
 * refleja en toda la plataforma sin ningún trabajo extra — solo hace falta
 * refrescar el JWT de la sesión activa (ver AvatarUploader + auth/config.ts)
 * para que el propio usuario lo vea sin re-loguearse.
 */
export async function updateAvatarUrl(avatarUrl: string): Promise<{ avatarUrl: string }> {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('No autorizado')
  }

  const parsed = AvatarSchema.parse({ avatarUrl })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatar_url: parsed.avatarUrl },
  })

  revalidatePath('/dashboard/cliente/perfil')
  revalidatePath('/dashboard/artesano/perfil')
  revalidatePath('/dashboard/cliente')
  revalidatePath('/dashboard/artesano')
  if (session.user.artisan_profile_id) {
    revalidatePath(`/artesano/${session.user.artisan_profile_id}`)
  }

  return { avatarUrl: parsed.avatarUrl }
}
