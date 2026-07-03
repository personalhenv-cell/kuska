'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const FundSchema = z.object({
  title: z.string().min(3).max(150),
  institution: z.string().min(2).max(120),
  amount: z.number().min(0),
  deadline: z.string().min(1),
  requirements: z.string().max(500).optional(),
  link: z.string().url().optional().or(z.literal('')),
})

export async function createFund(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  const parsed = FundSchema.parse({
    title: formData.get('title')?.toString() ?? '',
    institution: formData.get('institution')?.toString() ?? '',
    amount: Number(formData.get('amount')) || 0,
    deadline: formData.get('deadline')?.toString() ?? '',
    requirements: formData.get('requirements')?.toString() || undefined,
    link: formData.get('link')?.toString() || undefined,
  })

  await prisma.fundOpportunity.create({
    data: {
      title: parsed.title,
      institution: parsed.institution,
      amount: parsed.amount,
      deadline: new Date(parsed.deadline),
      requirements: parsed.requirements ? parsed.requirements.split(',').map((r) => r.trim()).filter(Boolean) : [],
      link: parsed.link || null,
      is_active: true,
    },
  })

  revalidatePath('/admin/capitalizacion')
}

export async function toggleFundActive(fundId: string, isActive: boolean): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  await prisma.fundOpportunity.update({ where: { id: fundId }, data: { is_active: isActive } })
  revalidatePath('/admin/capitalizacion')
}

export async function updateApplicationStatus(applicationId: string, status: string): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  await prisma.fundApplication.update({ where: { id: applicationId }, data: { status } })
  revalidatePath('/admin/capitalizacion')
}
