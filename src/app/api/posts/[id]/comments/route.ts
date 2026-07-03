import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const CommentSchema = z.object({ content: z.string().min(1).max(500) })

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const comments = await prisma.comment.findMany({
    where: { post_id: params.id },
    orderBy: { created_at: 'asc' },
  })
  const authorIds = [...new Set(comments.map((c) => c.author_id))]
  const authors = await prisma.user.findMany({
    where: { id: { in: authorIds } },
    select: { id: true, name: true, avatar_url: true },
  })
  const authorMap = new Map(authors.map((a) => [a.id, a]))

  return NextResponse.json({
    comments: comments.map((c) => ({ ...c, author: authorMap.get(c.author_id) ?? null })),
  })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = CommentSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Comentario inválido' }, { status: 400 })

  const comment = await prisma.comment.create({
    data: { post_id: params.id, author_id: session.user.id, content: parsed.data.content },
  })

  return NextResponse.json({ ok: true, comment }, { status: 201 })
}
