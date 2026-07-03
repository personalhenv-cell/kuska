'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export async function toggleUserActive(userId: string, isActive: boolean) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  await prisma.user.update({ where: { id: userId }, data: { is_active: isActive } })
  revalidatePath('/admin/usuarios')
}
