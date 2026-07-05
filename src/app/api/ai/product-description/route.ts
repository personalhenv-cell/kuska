import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { streamGemini } from '@/lib/gemini'

const DescriptionSchema = z.object({
  name: z.string().min(1).max(120),
  category: z.string().min(1).max(60),
  technique: z.string().min(1).max(60),
  region: z.string().min(1).max(60),
  materials: z.string().max(200).optional(),
  notes: z.string().max(400).optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    return new Response(JSON.stringify({ error: 'Debes iniciar sesión como artesano' }), { status: 401 })
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { id: session.user.artisan_profile_id },
    select: { membership_tier: true },
  })
  if (profile?.membership_tier !== 'pro' && profile?.membership_tier !== 'maestro') {
    return new Response(
      JSON.stringify({ error: 'Las descripciones con IA son parte del plan Artesano Pro o superior' }),
      { status: 403 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo inválido' }), { status: 400 })
  }
  const parsed = DescriptionSchema.safeParse(body)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Datos del producto inválidos' }), { status: 400 })
  }
  const { name, category, technique, region, materials, notes } = parsed.data

  const systemPrompt = `Eres un redactor experto en marketplace de artesanía peruana para Kuska. Escribes descripciones de producto en español, cálidas pero vendedoras, de 2-3 párrafos cortos, que resalten la técnica ancestral, el origen regional y el valor humano detrás de la pieza — sin inventar datos que no te dieron.`

  const userPrompt = `Escribe la descripción para este producto:
- Nombre: ${name}
- Categoría: ${category}
- Técnica: ${technique}
- Región: ${region}
${materials ? `- Materiales: ${materials}` : ''}
${notes ? `- Notas del artesano: ${notes}` : ''}`

  const readable = streamGemini({
    systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    maxOutputTokens: 400,
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
