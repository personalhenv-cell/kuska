'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

const PostSchema = z.object({
  title: z.string().min(3).max(150),
  excerpt: z.string().min(10).max(300),
  content: z.string().min(20),
  author: z.string().min(2).max(80),
  tags: z.string().max(200).optional(),
})

export async function createBlogPost(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  const parsed = PostSchema.parse({
    title: formData.get('title')?.toString() ?? '',
    excerpt: formData.get('excerpt')?.toString() ?? '',
    content: formData.get('content')?.toString() ?? '',
    author: formData.get('author')?.toString() ?? '',
    tags: formData.get('tags')?.toString() || undefined,
  })

  await prisma.blogPost.create({
    data: {
      title: parsed.title,
      slug: `${slugify(parsed.title)}-${Math.random().toString(36).slice(2, 7)}`,
      excerpt: parsed.excerpt,
      content: parsed.content,
      author: parsed.author,
      tags: parsed.tags ? parsed.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      is_published: true,
      published_at: new Date(),
    },
  })

  revalidatePath('/admin/academia')
}

export async function togglePublished(postId: string, isPublished: boolean): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') throw new Error('No autorizado')

  await prisma.blogPost.update({
    where: { id: postId },
    data: { is_published: isPublished, published_at: isPublished ? new Date() : null },
  })
  revalidatePath('/admin/academia')
}
