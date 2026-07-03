'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const RaicesSchema = z.object({
  story: z.string().max(3000).optional(),
  story_audio_url: z.string().url().optional().or(z.literal('')),
  genealogy: z.string().max(2000).optional(),
  workshop_photos: z.array(z.string().url()).max(12),
})

export async function updateRaices(input: {
  story?: string
  story_audio_url?: string
  genealogy?: string
  workshop_photos: string[]
}): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    throw new Error('No autorizado')
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { id: session.user.artisan_profile_id },
    select: { membership_tier: true },
  })
  if (profile?.membership_tier !== 'pro' && profile?.membership_tier !== 'maestro') {
    throw new Error('El módulo Raíces completo es parte del plan Pro o superior')
  }

  const parsed = RaicesSchema.parse(input)

  await prisma.artisanProfile.update({
    where: { id: session.user.artisan_profile_id },
    data: {
      story: parsed.story,
      story_audio_url: parsed.story_audio_url || null,
      genealogy: parsed.genealogy,
      workshop_photos: parsed.workshop_photos,
    },
  })

  revalidatePath('/dashboard/artesano/raices')
}
