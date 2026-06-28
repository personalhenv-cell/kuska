import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import { buildCfoSystemPrompt } from '@/lib/ai/cfo-prompt'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ARTESANO') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { message, conversationId } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })

    const apRows = await prisma.$queryRawUnsafe<Array<{
      id: string; display_name: string; total_sales: number; sales_count: number; tier: string
    }>>(
      `SELECT ap.id, ap."displayName" as display_name, ap."totalSales" as total_sales,
              cs."salesCount" as sales_count, cs.tier
       FROM artisan_profiles ap
       LEFT JOIN credit_scores cs ON cs."artisanId" = ap.id
       WHERE ap."userId" = $1 LIMIT 1`,
      session.user.id
    )
    if (!apRows || apRows.length === 0) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    const ap = apRows[0]

    const recentRecords = await prisma.$queryRawUnsafe<Array<{
      type: string; amount: number; description: string | null; recordedAt: string
    }>>(
      `SELECT type, amount, description, "recordedAt" FROM financial_records
       WHERE "artisanId" = $1 ORDER BY "recordedAt" DESC LIMIT 10`,
      ap.id
    )

    let messages: Array<{ role: 'user' | 'assistant'; content: string }> = []
    let convId = conversationId

    if (convId) {
      const convRows = await prisma.$queryRawUnsafe<Array<{ messages: unknown }>>(
        `SELECT messages FROM cfo_conversations WHERE id = $1 AND "artisanId" = $2 LIMIT 1`,
        convId, ap.id
      )
      if (convRows && convRows.length > 0) {
        messages = convRows[0].messages as typeof messages
      }
    }

    messages.push({ role: 'user', content: message })

    const systemPrompt = buildCfoSystemPrompt(ap.display_name, {
      salesTotal:    ap.total_sales,
      salesCount:    ap.sales_count,
      tier:          ap.tier,
      recentRecords: recentRecords.map(r => ({ ...r, recordedAt: String(r.recordedAt) })),
    })

    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system:     systemPrompt,
      messages,
    })

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : ''
    messages.push({ role: 'assistant', content: assistantMessage })

    if (convId) {
      await prisma.$executeRawUnsafe(
        `UPDATE cfo_conversations SET messages = $1::jsonb, "updatedAt" = NOW() WHERE id = $2`,
        JSON.stringify(messages), convId
      )
    } else {
      await prisma.$executeRawUnsafe(
        `INSERT INTO cfo_conversations (id, "artisanId", messages, "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2::jsonb, NOW(), NOW())`,
        ap.id, JSON.stringify(messages)
      )
      const newConv = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
        `SELECT id FROM cfo_conversations WHERE "artisanId" = $1 ORDER BY "createdAt" DESC LIMIT 1`, ap.id
      )
      convId = newConv[0]?.id
    }

    return NextResponse.json({ message: assistantMessage, conversationId: convId })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
