'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

export async function toggleProductAvailable(productId: string, isAvailable: boolean) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  await prisma.product.update({ where: { id: productId }, data: { is_available: isAvailable } })
  revalidatePath('/admin/productos')
}
