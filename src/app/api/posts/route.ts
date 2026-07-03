import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'

const CreatePostSchema = z.object({
  content: z.string().min(1).max(1000),
  images: z.array(z.string().url()).max(4).default([]),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const posts = await prisma.post.findMany({
    orderBy: { created_at: 'desc' },
    take: 50,
    include: {
      author: { select: { id: true, name: true, avatar_url: true, role: true } },
      _count: { select: { reactions: true, comments: true } },
      reactions: { where: { user_id: session.user.id }, select: { id: true } },
    },
  })

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      content: p.content,
      images: p.images,
      created_at: p.created_at,
      author: p.author,
      reaction_count: p._count.reactions,
      comment_count: p._count.comments,
      reacted_by_me: p.reactions.length > 0,
    })),
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = CreatePostSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Contenido inválido' }, { status: 400 })

  const post = await prisma.post.create({
    data: { author_id: session.user.id, content: parsed.data.content, images: parsed.data.images },
    include: { author: { select: { id: true, name: true, avatar_url: true, role: true } } },
  })

  return NextResponse.json({ ok: true, post }, { status: 201 })
}
