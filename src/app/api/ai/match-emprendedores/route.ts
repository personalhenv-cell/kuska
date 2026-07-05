import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { streamGemini } from '@/lib/gemini'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    return new Response(JSON.stringify({ error: 'Debes iniciar sesión como artesano' }), { status: 401 })
  }

  const artisan = await prisma.artisanProfile.findUnique({
    where: { id: session.user.artisan_profile_id },
    select: { membership_tier: true, specialty: true, technique: true, region: true, story: true },
  })
  if (artisan?.membership_tier !== 'maestro') {
    return new Response(
      JSON.stringify({ error: 'El Match con emprendedores es exclusivo del plan Artesano Maestro' }),
      { status: 403 },
    )
  }

  // Emprendedores reales registrados en la plataforma — sin esto no hay
  // con quién "matchear", y el plan exige que sea real, no inventado.
  const entrepreneurs = await prisma.clientProfile.findMany({
    where: { is_entrepreneur: true },
    include: { user: { select: { name: true } } },
    take: 25,
  })

  if (entrepreneurs.length === 0) {
    return new Response(
      'Todavía no hay clientes emprendedores registrados en Kuska para sugerirte un match. Vuelve a intentarlo cuando se unan más.',
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    )
  }

  const entrepreneurList = entrepreneurs
    .map(
      (e) =>
        `- ${e.user.name}: intereses [${e.interests.join(', ') || 'sin especificar'}], regiones [${e.regions_interest.join(', ') || 'sin especificar'}]${e.business_name ? `, negocio: ${e.business_name}` : ''}`,
    )
    .join('\n')

  const systemPrompt = `Eres el asistente de match de Kuska, que conecta artesanos con clientes emprendedores para posibles colaboraciones comerciales (ej. reventa, co-branding, distribución). Hablas en español, de forma concreta. Usa SOLO los datos reales que te doy — nunca inventes personas ni datos.`

  const userPrompt = `Artesano solicitando matches:
- Especialidad: ${artisan.specialty}
- Técnica: ${artisan.technique}
- Región: ${artisan.region}
${artisan.story ? `- Historia: ${artisan.story}` : ''}

Emprendedores registrados en Kuska:
${entrepreneurList}

Sugiere los 2-3 emprendedores con mejor potencial de colaboración con este artesano, explicando brevemente por qué en cada caso (1-2 líneas). Si ninguno encaja bien, dilo honestamente.`

  const readable = streamGemini({
    systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    maxOutputTokens: 500,
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
