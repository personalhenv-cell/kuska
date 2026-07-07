import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import { MembershipGate } from '@/components/dashboard/MembershipGate'
import { hasPlanAccess } from '@/lib/memberships'
import { ApplyButton } from './ApplyButton'

export default async function CapitalizacionPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const artisanId = session.user.artisan_profile_id
  const profile = await prisma.artisanProfile.findUnique({
    where: { id: artisanId },
    select: { membership_tier: true },
  })

  if (!hasPlanAccess(profile?.membership_tier, 'maestro')) {
    return <MembershipGate requiredPlan="maestro" featureName="El Hub de Capitalización" />
  }

  const funds = await prisma.fundOpportunity.findMany({
    where: { is_active: true, deadline: { gte: new Date() } },
    orderBy: { deadline: 'asc' },
    include: { applications: { where: { artisan_id: artisanId } } },
  })

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Hub de Capitalización</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">Fondos y convocatorias reales para hacer crecer tu taller.</p>
      </div>

      {funds.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <span className="text-4xl">💰</span>
          <p className="mt-3 font-body text-kuska-text-mid">No hay convocatorias activas en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {funds.map((f) => (
            <div key={f.id} className="rounded-card border border-kuska-border bg-white p-6">
              <h2 className="font-display text-lg font-bold text-kuska-text">{f.title}</h2>
              <p className="mt-1 font-body text-sm text-kuska-text-mid">{f.institution}</p>
              <p className="mt-2 font-display text-2xl font-bold text-kuska-teal">{formatPrice(f.amount)}</p>
              <p className="mt-1 font-body text-xs text-kuska-text-mid">Vence: {formatDate(f.deadline)}</p>
              {f.requirements.length > 0 && (
                <ul className="mt-3 space-y-1 font-body text-xs text-kuska-text-mid">
                  {f.requirements.map((r) => <li key={r}>• {r}</li>)}
                </ul>
              )}
              <div className="mt-4">
                <ApplyButton opportunityId={f.id} alreadyApplied={f.applications.length > 0} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
