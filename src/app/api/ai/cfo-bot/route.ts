import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { anthropic, KUSKA_AI_MODEL } from '@/lib/anthropic'

const MessageSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
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
  if (profile?.membership_tier !== 'maestro') {
    return new Response(
      JSON.stringify({ error: 'El CFO-Bot IA es exclusivo del plan Artesano Maestro' }),
      { status: 403 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo inválido' }), { status: 400 })
  }
  const parsed = MessageSchema.safeParse(body)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Mensajes inválidos' }), { status: 400 })
  }

  // Contexto financiero real del artesano — sin esto el CFO-bot no podría
  // "predecir ventas + alertar" como pide el plan Maestro.
  const artisanId = session.user.artisan_profile_id
  const products = await prisma.product.findMany({
    where: { artisan_id: artisanId },
    select: { name: true, price: true, stock: true, sales_count: true, views: true, rating: true },
  })
  const recentItems = await prisma.orderItem.findMany({
    where: { product: { artisan_id: artisanId } },
    include: { order: { select: { created_at: true, status: true } } },
    orderBy: { order: { created_at: 'desc' } },
    take: 30,
  })

  const totalRevenue = recentItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3)
  const noSales = products.filter((p) => p.sales_count === 0 && p.views > 10)

  const systemPrompt = `Eres el CFO-Bot de Kuska, un asesor financiero para artesanos peruanos que venden en la plataforma Kuska. Hablas en español, de forma cercana pero profesional, con datos concretos. NUNCA inventes cifras que no te doy — usa solo los datos reales de abajo.

Datos del taller del artesano:
- Productos activos: ${products.length}
- Ingresos de los últimos ${recentItems.length} pedidos: S/ ${totalRevenue.toFixed(2)}
- Productos con stock bajo (≤3 unidades): ${lowStock.map((p) => p.name).join(', ') || 'ninguno'}
- Productos con vistas pero sin ventas (posible problema de precio/descripción): ${noSales.map((p) => p.name).join(', ') || 'ninguno'}
- Detalle de productos: ${JSON.stringify(products.slice(0, 15))}

Da respuestas breves (máximo 4-5 líneas), accionables, y si detectas alertas reales en los datos (stock bajo, productos sin ventas) menciónalas proactivamente.`

  const stream = anthropic.messages.stream({
    model: KUSKA_AI_MODEL,
    max_tokens: 500,
    system: systemPrompt,
    messages: parsed.data.messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } catch {
        controller.enqueue(encoder.encode('\n\n[Error de conexión con el CFO-Bot. Intenta de nuevo.]'))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
