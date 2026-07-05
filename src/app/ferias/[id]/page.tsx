import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function FairDetailPage({ params }: { params: { id: string } }) {
  const fair = await prisma.digitalFair.findUnique({
    where: { id: params.id },
    include: {
      participants: {
        include: { artisan: { include: { user: { select: { name: true, avatar_url: true } } } } },
      },
    },
  })
  if (!fair) notFound()

  return (
    <div className="min-h-screen bg-kuska-cream">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pt-28 pb-12 sm:pt-32">
        <Link href="/ferias" className="font-body text-sm text-kuska-text-mid hover:text-kuska-red">← Todas las ferias</Link>
        <p className="mt-4 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold">{fair.theme}</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-kuska-text">{fair.title}</h1>
        <p className="mt-2 font-body text-kuska-text-mid">{fair.description}</p>
        <p className="mt-2 font-body text-sm text-kuska-text-mid">
          {formatDate(fair.start_date)} – {formatDate(fair.end_date)}
        </p>

        <h2 className="mt-10 font-display text-xl font-bold text-kuska-text">Stands ({fair.participants.length})</h2>
        {fair.participants.length === 0 ? (
          <p className="mt-3 font-body text-sm text-kuska-text-mid">Todavía no hay artesanos en esta feria.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fair.participants.map((p) => (
              <Link
                key={p.id}
                href={`/artesano/${p.artisan.id}`}
                className="flex items-center gap-3 rounded-card border border-kuska-border bg-white p-4 transition-transform hover:-translate-y-1"
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-kuska-cream-dark">
                  {p.artisan.user.avatar_url && (
                    <Image src={p.artisan.user.avatar_url} alt={p.artisan.user.name} width={48} height={48} className="h-full w-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-body font-semibold text-kuska-text">{p.artisan.user.name}</p>
                  <p className="font-body text-xs text-kuska-text-mid">{p.artisan.specialty} · {p.artisan.region}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
