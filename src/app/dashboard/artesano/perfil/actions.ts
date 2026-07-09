'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { normalizePeruPhone } from '@/lib/utils'

const ProfileSchema = z.object({
  bio: z.string().max(280).optional(),
  story: z.string().max(2000).optional(),
  specialty: z.string().min(1).max(80),
  technique: z.string().min(1).max(80),
  region: z.string().min(1).max(80),
  community: z.string().max(120).optional(),
  years_experience: z.coerce.number().int().min(0).max(80).optional(),
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
    community: formData.get('community')?.toString() || undefined,
    years_experience: formData.get('years_experience')?.toString() || undefined,
    whatsapp: formData.get('whatsapp')?.toString() || undefined,
  })

  // Se guarda siempre como "51" + 9 dígitos (sin espacios ni "+") — el
  // formato exacto que necesita un link wa.me. Antes se guardaba el texto
  // tal cual lo tipeaba el artesano, lo que rompía el botón de WhatsApp en
  // cuanto incluía espacios o le faltaba el código de país.
  let whatsapp = parsed.whatsapp
  if (whatsapp) {
    const local = normalizePeruPhone(whatsapp)
    if (!local) throw new Error('El número de WhatsApp debe ser un celular peruano válido (9 dígitos, empieza con 9)')
    whatsapp = `51${local}`
  }

  await prisma.artisanProfile.update({
    where: { id: session.user.artisan_profile_id },
    data: { ...parsed, whatsapp },
  })

  revalidatePath('/dashboard/artesano/perfil')
}
