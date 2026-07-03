import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { MembershipGate } from '@/components/dashboard/MembershipGate'
import { RaicesEditor } from './RaicesEditor'

export default async function RaicesPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { id: session.user.artisan_profile_id },
    select: { membership_tier: true, story: true, story_audio_url: true, genealogy: true, workshop_photos: true },
  })

  if (profile?.membership_tier !== 'pro' && profile?.membership_tier !== 'maestro') {
    return <MembershipGate requiredPlan="pro" featureName="El módulo Raíces completo" />
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Módulo Raíces</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Tu historia completa, galería, audio y árbol genealógico — visible en tu perfil público.
        </p>
      </div>
      <RaicesEditor
        initial={{
          story: profile?.story ?? '',
          story_audio_url: profile?.story_audio_url ?? '',
          genealogy: profile?.genealogy ?? '',
          workshop_photos: profile?.workshop_photos ?? [],
        }}
      />
    </div>
  )
}
