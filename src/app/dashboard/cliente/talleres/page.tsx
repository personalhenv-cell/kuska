import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ClienteTalleresPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const enrollments = await prisma.workshopParticipant.findMany({
    where: { user_id: session.user.id },
    orderBy: { joined_at: 'desc' },
    include: {
      workshop: {
        include: { artisan: { select: { region: true, user: { select: { name: true } } } } },
      },
    },
  })

  const now = new Date()

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-kuska-text">Mis talleres</h1>
          <p className="mt-1 font-body text-sm text-kuska-text-mid">
            Los talleres en vivo a los que te has inscrito.
          </p>
        </div>
        <Link
          href="/talleres"
          className="rounded-input bg-kuska-red px-5 py-2.5 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Explorar talleres
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <span className="text-4xl">🧑‍🏫</span>
          <p className="mt-3 font-body text-kuska-text-mid">
            Aún no te has inscrito a ningún taller.{' '}
            <Link href="/talleres" className="font-semibold text-kuska-red hover:underline">
              Descubre los próximos
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {enrollments.map((e) => {
            const past = e.workshop.date < now
            return (
              <Link
                key={e.id}
                href={`/talleres/${e.workshop.id}`}
                className="rounded-card border border-kuska-border bg-white p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-kuska-teal/10 px-2.5 py-0.5 font-nunito text-xs font-bold text-kuska-teal">
                    {e.workshop.is_virtual ? '🌐 Virtual' : '📍 Presencial'}
                  </span>
                  {past ? (
                    <span className="rounded-full bg-kuska-border/40 px-2.5 py-0.5 font-nunito text-xs font-bold text-kuska-text-mid">
                      Finalizado
                    </span>
                  ) : (
                    <span className="rounded-full bg-kuska-gold/10 px-2.5 py-0.5 font-nunito text-xs font-bold text-kuska-gold">
                      Próximo
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-display text-lg font-bold text-kuska-text">{e.workshop.title}</h2>
                <p className="mt-1 font-body text-xs text-kuska-text-mid">
                  Por {e.workshop.artisan.user.name} · {e.workshop.artisan.region}
                </p>
                <p className="mt-3 font-body text-xs text-kuska-text-mid">
                  {formatDate(e.workshop.date)} · {e.workshop.price > 0 ? formatPrice(e.workshop.price) : 'Gratis'}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
