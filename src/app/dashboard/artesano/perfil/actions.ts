'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const ProfileSchema = z.object({
  bio: z.string().max(280).optional(),
  story: z.string().max(2000).optional(),
  specialty: z.string().min(1).max(80),
  technique: z.string().min(1).max(80),
  region: z.string().min(1).max(80),
  whatsapp: z.string().max(20).optional(),
})

export async function updateArtisanProfile(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    throw new Error('No autorizado')
  }

  const parsed = ProfileSchema.parse({
    bio: formData.get('bio')?.toString() || undefined,
    story: formData.get('story')?.toString() || undefined,
    specialty: formData.get('specialty')?.toString() ?? '',
    technique: formData.get('technique')?.toString() ?? '',
    region: formData.get('region')?.toString() ?? '',
    whatsapp: formData.get('whatsapp')?.toString() || undefined,
  })

  await prisma.artisanProfile.update({
    where: { id: session.user.artisan_profile_id },
    data: parsed,
  })

  revalidatePath('/dashboard/artesano/perfil')
}
