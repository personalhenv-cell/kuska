'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export async function joinFair(fairId: string): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    throw new Error('No autorizado')
  }

  const existing = await prisma.fairParticipant.findFirst({
    where: { fair_id: fairId, artisan_id: session.user.artisan_profile_id },
  })
  if (existing) return

  await prisma.fairParticipant.create({
    data: { fair_id: fairId, artisan_id: session.user.artisan_profile_id },
  })

  revalidatePath('/dashboard/artesano/ferias')
}
