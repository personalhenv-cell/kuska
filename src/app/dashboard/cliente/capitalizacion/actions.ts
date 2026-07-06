'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export async function applyToFundAsEntrepreneur(opportunityId: string): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente' || !session.user.is_entrepreneur) {
    throw new Error('El Hub de Capitalización es exclusivo de clientes emprendedores')
  }

  const clientProfile = await prisma.clientProfile.findUnique({
    where: { user_id: session.user.id },
    select: { id: true },
  })
  if (!clientProfile) throw new Error('Perfil de cliente no encontrado')

  const existing = await prisma.fundApplication.findFirst({
    where: { opportunity_id: opportunityId, client_id: clientProfile.id },
  })
  if (existing) return

  await prisma.fundApplication.create({
    data: { opportunity_id: opportunityId, client_id: clientProfile.id },
  })

  revalidatePath('/dashboard/cliente/capitalizacion')
}
