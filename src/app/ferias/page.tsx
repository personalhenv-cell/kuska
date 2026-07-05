import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function FeriasPage() {
  const fairs = await prisma.digitalFair.findMany({
    where: { is_active: true },
    orderBy: { start_date: 'asc' },
    include: { _count: { select: { participants: true } } },
  })

  return (
    <div className="min-h-screen bg-kuska-cream">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pt-28 pb-12 sm:pt-32">
        <h1 className="font-display text-3xl font-bold text-kuska-text">Ferias Digitales</h1>
        <p className="mt-2 font-body text-kuska-text-mid">Stands virtuales donde los artesanos de Kuska muestran su arte por temporada.</p>

        {fairs.length === 0 ? (
          <div className="mt-8 rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
            <span className="text-4xl">🎪</span>
            <p className="mt-3 font-body text-kuska-text-mid">No hay ferias activas en este momento.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {fairs.map((f) => (
              <Link
                key={f.id}
                href={`/ferias/${f.id}`}
                className="rounded-card border border-kuska-border bg-white p-6 transition-transform hover:-translate-y-1"
              >
                <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold">{f.theme}</p>
                <h2 className="mt-1.5 font-display text-xl font-bold text-kuska-text">{f.title}</h2>
                <p className="mt-2 font-body text-sm text-kuska-text-mid line-clamp-2">{f.description}</p>
                <p className="mt-3 font-body text-xs text-kuska-text-mid">
                  {formatDate(f.start_date)} – {formatDate(f.end_date)} · {f._count.participants} artesanos
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
