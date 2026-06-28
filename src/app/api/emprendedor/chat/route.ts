import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { buildEmprendedorSystemPrompt, buildPlanPrompt } from '@/lib/ai/emprendedor-prompt'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { message, history } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })

    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...(history ?? []),
      { role: 'user', content: message },
    ]

    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system:     buildEmprendedorSystemPrompt(),
      messages,
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ message: reply })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { ideaTitle, ideaDesc } = await req.json()
    if (!ideaTitle || !ideaDesc) return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 })

    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: buildPlanPrompt(ideaTitle, ideaDesc) }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const plan = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim())

    return NextResponse.json({ plan })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
