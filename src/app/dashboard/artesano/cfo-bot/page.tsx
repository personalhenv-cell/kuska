import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { MembershipGate } from '@/components/dashboard/MembershipGate'
import { CfoBotChat } from './CfoBotChat'

export default async function CfoBotPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { id: session.user.artisan_profile_id },
    select: { membership_tier: true },
  })

  if (profile?.membership_tier !== 'maestro') {
    return <MembershipGate requiredPlan="maestro" featureName="El CFO-Bot IA" />
  }

  return (
    <div className="flex h-[calc(100vh-1px)] flex-col p-6 lg:p-10">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-kuska-text">CFO-Bot IA</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Tu asesor financiero con predicción de ventas y alertas, basado en los datos reales de tu taller.
        </p>
      </div>
      <CfoBotChat />
    </div>
  )
}
