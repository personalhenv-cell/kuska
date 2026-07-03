import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { MembershipGate } from '@/components/dashboard/MembershipGate'
import { formatDate } from '@/lib/utils'

export default async function AcademiaPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { id: session.user.artisan_profile_id },
    select: { membership_tier: true },
  })

  if (profile?.membership_tier !== 'pro' && profile?.membership_tier !== 'maestro') {
    return <MembershipGate requiredPlan="pro" featureName="Academia Kuska" />
  }

  const posts = await prisma.blogPost.findMany({
    where: { is_published: true },
    orderBy: { published_at: 'desc' },
  })

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Academia Kuska</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Lecciones y artículos para hacer crecer tu negocio artesanal.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <span className="text-4xl">🎓</span>
          <p className="mt-3 font-body text-kuska-text-mid">Aún no hay lecciones publicadas. Vuelve pronto.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/artesano/academia/${p.slug}`}
              className="rounded-card border border-kuska-border bg-white p-5 transition-transform hover:-translate-y-1"
            >
              <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold">
                {p.tags[0] ?? 'Academia'}
              </p>
              <h3 className="mt-1.5 font-display text-lg font-bold text-kuska-text">{p.title}</h3>
              <p className="mt-2 font-body text-sm text-kuska-text-mid line-clamp-3">{p.excerpt}</p>
              <p className="mt-3 font-body text-xs text-kuska-text-mid">
                {p.author} · {p.published_at ? formatDate(p.published_at) : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
