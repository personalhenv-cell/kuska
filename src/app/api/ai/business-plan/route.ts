import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { streamGemini } from '@/lib/gemini'

const PlanSchema = z.object({
  business_name: z.string().min(2).max(120),
  category: z.string().min(2).max(80),
  description: z.string().min(10).max(600),
  target_market: z.string().min(2).max(300),
  initial_budget: z.number().min(0).max(1_000_000),
  region: z.string().min(2).max(80),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente' || !session.user.is_entrepreneur) {
    return new Response(
      JSON.stringify({ error: 'El Emprendedor IA es solo para clientes que se marcaron como emprendedores' }),
      { status: 403 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo inválido' }), { status: 400 })
  }
  const parsed = PlanSchema.safeParse(body)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Datos del negocio inválidos' }), { status: 400 })
  }
  const { business_name, category, description, target_market, initial_budget, region } = parsed.data

  const systemPrompt = `Eres un asesor de negocios experto en emprendimiento artesanal y comercio peruano para Kuska. Generas planes de negocio en español, en formato Markdown con encabezados ## para cada sección, concretos y accionables, usando SOLO los datos reales que te da el usuario — nunca inventes cifras de mercado que no puedas fundamentar en lo que te dieron. Incluye estas secciones, en este orden: ## Resumen ejecutivo, ## Análisis de mercado, ## Propuesta de valor, ## Plan financiero inicial, ## Próximos pasos. Sé breve y claro en cada sección (3-5 líneas), en total no más de 500 palabras.`

  const userPrompt = `Genera un plan de negocio para este emprendimiento:
- Nombre del negocio: ${business_name}
- Rubro: ${category}
- Descripción: ${description}
- Público objetivo: ${target_market}
- Presupuesto inicial: S/ ${initial_budget}
- Región: ${region}`

  const readable = streamGemini({
    systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    maxOutputTokens: 1300,
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
