import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatDate, formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function TalleresPage() {
  const workshops = await prisma.workshop.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    include: {
      artisan: { select: { region: true, user: { select: { name: true } } } },
      _count: { select: { participants: true } },
    },
  })

  return (
    <div className="min-h-screen bg-kuska-cream">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pt-28 pb-12 sm:pt-32">
        <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold">Academia Kuska</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-kuska-text">Talleres en vivo</h1>
        <p className="mt-2 font-body text-kuska-text-mid">
          Aprende técnicas ancestrales directamente de los maestros artesanos del Perú.
        </p>

        {workshops.length === 0 ? (
          <div className="mt-8 rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
            <span className="text-4xl">🧑‍🏫</span>
            <p className="mt-3 font-body text-kuska-text-mid">Aún no hay talleres programados. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {workshops.map((w) => {
              const full = w._count.participants >= w.capacity
              return (
                <Link
                  key={w.id}
                  href={`/talleres/${w.id}`}
                  className="group rounded-card border border-kuska-border bg-white p-6 transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-kuska-teal/10 px-2.5 py-0.5 font-nunito text-xs font-bold text-kuska-teal">
                      {w.is_virtual ? '🌐 Virtual' : '📍 Presencial'}
                    </span>
                    {full && (
                      <span className="rounded-full bg-kuska-red/10 px-2.5 py-0.5 font-nunito text-xs font-bold text-kuska-red">
                        Lleno
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-display text-xl font-bold text-kuska-text group-hover:text-kuska-red">
                    {w.title}
                  </h2>
                  <p className="mt-1.5 font-body text-sm text-kuska-text-mid line-clamp-2">{w.description}</p>
                  <p className="mt-3 font-body text-xs text-kuska-text-mid">
                    Por <span className="font-semibold text-kuska-text">{w.artisan.user.name}</span> · {w.artisan.region}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-body text-xs text-kuska-text-mid">
                      {formatDate(w.date)} · {w._count.participants}/{w.capacity} cupos
                    </span>
                    <span className="font-display text-sm font-bold text-kuska-gold">
                      {w.price > 0 ? formatPrice(w.price) : 'Gratis'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
