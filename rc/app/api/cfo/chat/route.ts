import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ARTESANO') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { messages, artisanId } = await req.json()

    let contexto = ''
    if (artisanId) {
      const [records, score, products] = await Promise.all([
        prisma.financialRecord.findMany({ where: { artisanId }, orderBy: { recordedAt: 'desc' }, take: 20 }),
        prisma.creditScore.findUnique({ where: { artisanId } }),
        prisma.product.count({ where: { artisanId, status: 'ACTIVE' } }),
      ])
      const ingresos = records.filter(r => r.type === 'INGRESO').reduce((s, r) => s + r.amount, 0)
      const egresos  = records.filter(r => r.type === 'EGRESO').reduce((s, r) => s + r.amount, 0)
      contexto = `
CONTEXTO FINANCIERO:
- Ingresos: S/ ${ingresos.toFixed(2)}
- Egresos:  S/ ${egresos.toFixed(2)}
- Ganancia: S/ ${(ingresos - egresos).toFixed(2)}
- Productos activos: ${products}
- Score Kuska: ${score?.score || 0}/1000 (${score?.tier || 'BRONCE'})`
    }

    const systemPrompt = `Eres el CFO-bot de Kuska, asistente financiero para artesanos peruanos.
${contexto}
Habla en español simple y amigable. Da consejos prácticos y específicos. Sé empático con los desafíos del mercado artesanal. Usa emojis ocasionalmente.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 1024,
        stream:     true,
        system:     systemPrompt,
        messages:   messages.map((m: any) => ({ role: m.role, content: m.content })),
      }),
    })

    if (!response.ok) throw new Error('Error en Claude API')

    const stream = new ReadableStream({
      async start(controller) {
        const reader  = response.body?.getReader()
        const decoder = new TextDecoder()
        while (reader) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
          for (const line of lines) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'content_block_delta' && data.delta?.text) {
                controller.enqueue(new TextEncoder().encode(data.delta.text))
              }
            } catch { /* ignorar */ }
          }
        }
        controller.close()
      },
    })

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch {
    return NextResponse.json({ error: 'Error en el CFO-bot' }, { status: 500 })
  }
}
