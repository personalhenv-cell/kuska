'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const FairSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10).max(1000),
  theme: z.string().min(2).max(100),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
})

export async function createFair(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  const parsed = FairSchema.parse({
    title: formData.get('title')?.toString() ?? '',
    description: formData.get('description')?.toString() ?? '',
    theme: formData.get('theme')?.toString() ?? '',
    start_date: formData.get('start_date')?.toString() ?? '',
    end_date: formData.get('end_date')?.toString() ?? '',
  })

  await prisma.digitalFair.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      theme: parsed.theme,
      start_date: new Date(parsed.start_date),
      end_date: new Date(parsed.end_date),
      is_active: true,
    },
  })

  revalidatePath('/admin/ferias')
}

export async function toggleFairActive(fairId: string, isActive: boolean): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  await prisma.digitalFair.update({ where: { id: fairId }, data: { is_active: isActive } })
  revalidatePath('/admin/ferias')
}
