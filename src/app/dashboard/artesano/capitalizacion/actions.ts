'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export async function applyToFund(opportunityId: string): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    throw new Error('No autorizado')
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { id: session.user.artisan_profile_id },
    select: { membership_tier: true },
  })
  if (profile?.membership_tier !== 'maestro') {
    throw new Error('El Hub de Capitalización es exclusivo del plan Artesano Maestro')
  }

  const existing = await prisma.fundApplication.findFirst({
    where: { opportunity_id: opportunityId, artisan_id: session.user.artisan_profile_id },
  })
  if (existing) return

  await prisma.fundApplication.create({
    data: { opportunity_id: opportunityId, artisan_id: session.user.artisan_profile_id },
  })

  revalidatePath('/dashboard/artesano/capitalizacion')
}
