import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice } from '@/lib/utils'
import { CreateWorkshopForm } from './CreateWorkshopForm'

export const dynamic = 'force-dynamic'

export default async function ArtisanTalleresPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const workshops = await prisma.workshop.findMany({
    where: { artisan_id: session.user.artisan_profile_id },
    orderBy: { date: 'desc' },
    include: {
      _count: { select: { participants: true } },
    },
  })

  const now = new Date()

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-kuska-text">Mis talleres</h1>
          <p className="mt-1 font-body text-sm text-kuska-text-mid">
            Comparte tu técnica en vivo y gana ingresos enseñando.
          </p>
        </div>
        <CreateWorkshopForm />
      </div>

      {workshops.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <span className="text-4xl">🧑‍🏫</span>
          <p className="mt-3 font-body text-kuska-text-mid">
            Aún no has creado talleres. Crea el primero y aparecerá en la Academia pública.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {workshops.map((w) => {
            const past = w.date < now
            const full = w._count.participants >= w.capacity
            return (
              <div key={w.id} className="rounded-card border border-kuska-border bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-kuska-teal/10 px-2.5 py-0.5 font-nunito text-xs font-bold text-kuska-teal">
                        {w.is_virtual ? '🌐 Virtual' : '📍 Presencial'}
                      </span>
                      {past && (
                        <span className="rounded-full bg-kuska-border/40 px-2.5 py-0.5 font-nunito text-xs font-bold text-kuska-text-mid">
                          Finalizado
                        </span>
                      )}
                      {!past && full && (
                        <span className="rounded-full bg-kuska-red/10 px-2.5 py-0.5 font-nunito text-xs font-bold text-kuska-red">
                          Lleno
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 font-display text-lg font-bold text-kuska-text">{w.title}</h2>
                    <p className="mt-1 font-body text-xs text-kuska-text-mid">
                      {formatDate(w.date)} · {w.price > 0 ? formatPrice(w.price) : 'Gratis'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-kuska-red">
                      {w._count.participants}
                      <span className="font-body text-sm font-normal text-kuska-text-mid">/{w.capacity}</span>
                    </p>
                    <p className="font-nunito text-xs text-kuska-text-mid">inscritos</p>
                  </div>
                </div>
                <p className="mt-3 font-body text-sm text-kuska-text-mid line-clamp-2">{w.description}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
