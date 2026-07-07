import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

const CreatePostSchema = z.object({
  content: z.string().min(1).max(1000),
  images: z.array(z.string().url()).max(4).default([]),
})

const ACTIVE_WINDOW_DAYS = 30

async function countActiveUsers(): Promise<number> {
  const since = new Date(Date.now() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000)

  const [posters, commenters, reactors] = await Promise.all([
    prisma.post.findMany({ where: { created_at: { gte: since } }, distinct: ['author_id'], select: { author_id: true } }),
    prisma.comment.findMany({ where: { created_at: { gte: since } }, distinct: ['author_id'], select: { author_id: true } }),
    prisma.reaction.findMany({ where: { created_at: { gte: since } }, distinct: ['user_id'], select: { user_id: true } }),
  ])

  const activeIds = new Set<string>()
  posters.forEach((p) => activeIds.add(p.author_id))
  commenters.forEach((c) => activeIds.add(c.author_id))
  reactors.forEach((r) => activeIds.add(r.user_id))

  return activeIds.size
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const roleFilter = searchParams.get('role')
  const sort = searchParams.get('sort') === 'populares' ? 'populares' : 'recientes'

  const where: Prisma.PostWhereInput =
    roleFilter === 'artesano' || roleFilter === 'cliente' ? { author: { role: roleFilter } } : {}

  const orderBy: Prisma.PostOrderByWithRelationInput[] =
    sort === 'populares' ? [{ reactions: { _count: 'desc' } }, { created_at: 'desc' }] : [{ created_at: 'desc' }]

  const [posts, activeUsers] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy,
      take: 50,
      include: {
        author: { select: { id: true, name: true, avatar_url: true, role: true } },
        _count: { select: { reactions: true, comments: true } },
        reactions: { where: { user_id: session.user.id }, select: { id: true } },
      },
    }),
    countActiveUsers(),
  ])

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
    active_users: activeUsers,
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
