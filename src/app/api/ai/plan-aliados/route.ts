import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { generateGemini } from '@/lib/gemini'

const AliadosSchema = z.object({
  category: z.string().min(2).max(80),
  region: z.string().min(2).max(80),
  description: z.string().min(10).max(600),
})

/**
 * Tras generar su plan de negocio, el emprendedor puede pedir aliados
 * sugeridos por Kuska IA: artesanos verificados afines (posibles
 * proveedores/colaboradores) y otros clientes emprendedores con intereses o
 * región en común (posible networking). Usa SOLO datos reales de la
 * plataforma — igual que /api/ai/match-emprendedores, nunca inventa personas.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente' || !session.user.is_entrepreneur) {
    return new Response(
      JSON.stringify({ error: 'Los aliados sugeridos son solo para clientes emprendedores' }),
      { status: 403 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo inválido' }), { status: 400 })
  }
  const parsed = AliadosSchema.safeParse(body)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Datos inválidos' }), { status: 400 })
  }
  const { category, region, description } = parsed.data

  const [artisans, peers] = await Promise.all([
    prisma.artisanProfile.findMany({
      where: {
        is_verified: true,
        OR: [
          { region: { equals: region, mode: 'insensitive' } },
          { specialty: { contains: category, mode: 'insensitive' } },
        ],
      },
      include: { user: { select: { name: true } } },
      orderBy: { rating: 'desc' },
      take: 6,
    }),
    prisma.clientProfile.findMany({
      where: {
        is_entrepreneur: true,
        user_id: { not: session.user.id },
        OR: [{ regions_interest: { has: region } }, { interests: { has: category } }],
      },
      include: { user: { select: { name: true } } },
      take: 6,
    }),
  ])

  if (artisans.length === 0 && peers.length === 0) {
    return new Response(
      'Todavía no hay suficientes artesanos verificados u otros emprendedores registrados en Kuska con región o rubro afín al tuyo. Vuelve a intentarlo cuando se unan más a la plataforma.',
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    )
  }

  const artisanList = artisans
    .map((a) => `- ${a.user.name}: especialidad ${a.specialty}, técnica ${a.technique}, región ${a.region}`)
    .join('\n')
  const peerList = peers
    .map(
      (p) =>
        `- ${p.user.name}: intereses [${p.interests.join(', ') || 'sin especificar'}], regiones [${p.regions_interest.join(', ') || 'sin especificar'}]${p.business_name ? `, negocio: ${p.business_name}` : ''}`,
    )
    .join('\n')

  const systemPrompt = `Eres el asistente de aliados de Kuska. Ayudas a un cliente emprendedor a identificar posibles colaboraciones reales dentro de la plataforma: artesanos verificados que podrían ser proveedores o socios de producto, y otros emprendedores con intereses o región afines para hacer networking. Hablas en español, de forma concreta y breve. Usa SOLO los datos reales que te doy — nunca inventes personas ni datos que no te di.`

  const userPrompt = `Emprendedor solicitando aliados:
- Rubro: ${category}
- Región: ${region}
- Descripción del negocio: ${description}

${artisanList ? `Artesanos verificados registrados en Kuska:\n${artisanList}` : 'No hay artesanos verificados con región o rubro afín.'}

${peerList ? `Otros clientes emprendedores registrados en Kuska:\n${peerList}` : 'No hay otros emprendedores con intereses o región afines.'}

Sugiere hasta 3 artesanos y hasta 2 emprendedores con mejor potencial de colaboración, explicando en 1-2 líneas por qué cada uno encaja. Organiza la respuesta en dos secciones: "## Posibles artesanos aliados" y "## Otros emprendedores afines". Si una lista está vacía, dilo honestamente en esa sección.`

  try {
    const text = await generateGemini({
      systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      maxOutputTokens: 600,
    })
    return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch (e) {
    console.error('[plan-aliados] error inesperado:', e instanceof Error ? e.message : e)
    return new Response(JSON.stringify({ error: 'Kuska IA no pudo sugerir aliados. Intenta de nuevo.' }), { status: 500 })
  }
}
