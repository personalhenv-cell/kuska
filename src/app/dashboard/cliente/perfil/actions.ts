'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const ProfileSchema = z.object({
  interests: z.array(z.string()).max(20),
  regions_interest: z.array(z.string()).max(30),
  is_entrepreneur: z.boolean(),
  business_name: z.string().max(120).optional(),
  newsletter: z.boolean(),
})

export async function updateClientProfile(data: z.infer<typeof ProfileSchema>): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') {
    throw new Error('No autorizado')
  }

  const parsed = ProfileSchema.parse(data)

  await prisma.clientProfile.update({
    where: { user_id: session.user.id },
    data: {
      interests: parsed.interests,
      regions_interest: parsed.regions_interest,
      is_entrepreneur: parsed.is_entrepreneur,
      business_name: parsed.is_entrepreneur ? parsed.business_name || null : null,
      newsletter: parsed.newsletter,
    },
  })

  revalidatePath('/dashboard/cliente/perfil')
  revalidatePath('/dashboard/cliente')
}

/**
 * Activa el modo emprendedor con un solo clic desde el "gate" de los módulos
 * IA/Capitalización, sin obligar a ir al perfil. El cliente debe además
 * refrescar su sesión (useSession().update) para que los sidebars y gates
 * lo vean sin re-login.
 */
export async function activateEntrepreneurMode(): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') {
    throw new Error('No autorizado')
  }

  await prisma.clientProfile.update({
    where: { user_id: session.user.id },
    data: { is_entrepreneur: true },
  })

  revalidatePath('/dashboard/cliente/emprendedor')
  revalidatePath('/dashboard/cliente/capitalizacion')
  revalidatePath('/dashboard/cliente')
}
