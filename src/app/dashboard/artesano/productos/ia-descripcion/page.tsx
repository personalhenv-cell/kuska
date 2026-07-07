import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { MembershipGate } from '@/components/dashboard/MembershipGate'
import { hasPlanAccess } from '@/lib/memberships'
import { DescriptionGenerator } from './DescriptionGenerator'

export default async function IaDescripcionPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { id: session.user.artisan_profile_id },
    select: { membership_tier: true },
  })

  if (!hasPlanAccess(profile?.membership_tier, 'pro')) {
    return <MembershipGate requiredPlan="pro" featureName="Las descripciones con IA" />
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-2xl font-bold text-kuska-text">Descripción de producto con IA</h1>
      <p className="mt-1 font-body text-sm text-kuska-text-mid">
        Cuéntanos sobre tu pieza y generamos una descripción lista para publicar. Sin límite en tu plan.
      </p>
      <div className="mt-6">
        <DescriptionGenerator />
      </div>
    </div>
  )
}
