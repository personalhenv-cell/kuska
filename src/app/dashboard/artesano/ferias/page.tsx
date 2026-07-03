import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { JoinFairButton } from './JoinFairButton'

export default async function ArtisanFeriasPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const artisanId = session.user.artisan_profile_id
  const fairs = await prisma.digitalFair.findMany({
    where: { is_active: true },
    orderBy: { start_date: 'asc' },
    include: { participants: { where: { artisan_id: artisanId } } },
  })

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Ferias Digitales</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">Únete con tu stand virtual, gratis para todos los planes.</p>
      </div>

      {fairs.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <span className="text-4xl">🎪</span>
          <p className="mt-3 font-body text-kuska-text-mid">No hay ferias activas en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {fairs.map((f) => (
            <div key={f.id} className="rounded-card border border-kuska-border bg-white p-6">
              <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold">{f.theme}</p>
              <h2 className="mt-1.5 font-display text-lg font-bold text-kuska-text">{f.title}</h2>
              <p className="mt-2 font-body text-sm text-kuska-text-mid">{f.description}</p>
              <p className="mt-3 font-body text-xs text-kuska-text-mid">
                {formatDate(f.start_date)} – {formatDate(f.end_date)}
              </p>
              <div className="mt-4">
                <JoinFairButton fairId={f.id} alreadyJoined={f.participants.length > 0} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
