import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { MembershipGate } from '@/components/dashboard/MembershipGate'
import { MatchFinder } from './MatchFinder'

export default async function MatchIaPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { id: session.user.artisan_profile_id },
    select: { membership_tier: true },
  })

  if (profile?.membership_tier !== 'maestro') {
    return <MembershipGate requiredPlan="maestro" featureName="Match artesano-emprendedor con IA" />
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Match con emprendedores</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          La IA sugiere clientes emprendedores reales de Kuska con potencial de colaboración contigo.
        </p>
      </div>
      <MatchFinder />
    </div>
  )
}
