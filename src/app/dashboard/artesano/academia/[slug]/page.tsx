import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { MembershipGate } from '@/components/dashboard/MembershipGate'
import { hasPlanAccess } from '@/lib/memberships'
import { formatDate } from '@/lib/utils'

export default async function AcademiaPostPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { id: session.user.artisan_profile_id },
    select: { membership_tier: true },
  })

  if (!hasPlanAccess(profile?.membership_tier, 'pro')) {
    return <MembershipGate requiredPlan="pro" featureName="Academia Kuska" />
  }

  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post || !post.is_published) notFound()

  prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => null)

  return (
    <div className="p-6 lg:p-10">
      <Link href="/dashboard/artesano/academia" className="font-body text-sm text-kuska-text-mid hover:text-kuska-red">
        ← Volver a Academia
      </Link>
      <article className="mt-4 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-kuska-text">{post.title}</h1>
        <p className="mt-2 font-body text-sm text-kuska-text-mid">
          {post.author} · {post.published_at ? formatDate(post.published_at) : ''}
        </p>
        <p className="mt-6 whitespace-pre-line font-body leading-relaxed text-kuska-text">{post.content}</p>
      </article>
    </div>
  )
}
