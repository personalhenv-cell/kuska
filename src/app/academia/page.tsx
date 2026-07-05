import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Academia Kuska — Aprende de los maestros artesanos',
  description: 'Lecciones, artículos y talleres en vivo para hacer crecer tu arte y tu negocio artesanal.',
}

export default async function AcademiaPublicaPage() {
  const [posts, upcomingWorkshops] = await Promise.all([
    prisma.blogPost.findMany({
      where: { is_published: true },
      orderBy: { published_at: 'desc' },
      take: 12,
    }),
    prisma.workshop.count({ where: { date: { gte: new Date() } } }),
  ])

  return (
    <div className="min-h-screen bg-kuska-cream">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pt-28 pb-12 sm:pt-32">
        <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold">Aprende con Kuska</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-kuska-text md:text-4xl">Academia Kuska</h1>
        <p className="mt-2 max-w-2xl font-body text-kuska-text-mid">
          Conocimiento ancestral y herramientas modernas para hacer crecer tu arte. Artículos, lecciones y
          talleres en vivo dictados por los propios maestros.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/talleres"
            className="rounded-input bg-kuska-red px-5 py-2.5 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            🧑‍🏫 Ver talleres en vivo {upcomingWorkshops > 0 && `(${upcomingWorkshops})`}
          </Link>
          <Link
            href="/registro/artesano"
            className="rounded-input border border-kuska-border bg-white px-5 py-2.5 font-body text-sm font-semibold text-kuska-text transition-transform hover:-translate-y-0.5"
          >
            Únete como artesano
          </Link>
        </div>

        <h2 className="mt-12 font-display text-xl font-bold text-kuska-text">Artículos y lecciones</h2>

        {posts.length === 0 ? (
          <div className="mt-6 rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
            <span className="text-4xl">🎓</span>
            <p className="mt-3 font-body text-kuska-text-mid">Pronto publicaremos las primeras lecciones.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article
                key={p.id}
                className="overflow-hidden rounded-card border border-kuska-border bg-white transition-transform hover:-translate-y-1"
              >
                {p.cover_url && (
                  <div className="relative h-40 w-full">
                    <Image src={p.cover_url} alt={p.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  {p.tags[0] && (
                    <span className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-teal">
                      {p.tags[0]}
                    </span>
                  )}
                  <h3 className="mt-1 font-display text-lg font-bold text-kuska-text">{p.title}</h3>
                  <p className="mt-1.5 font-body text-sm text-kuska-text-mid line-clamp-3">{p.excerpt}</p>
                  <p className="mt-3 font-body text-xs text-kuska-text-mid">
                    {p.author}
                    {p.published_at && <> · {formatDate(p.published_at)}</>}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
