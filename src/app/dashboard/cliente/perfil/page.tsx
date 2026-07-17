import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { AvatarUploader } from '@/components/ui/AvatarUploader'
import { NicknameField } from '@/components/ui/NicknameField'
import { ClientProfileForm } from './ClientProfileForm'

export default async function ClientProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') {
    redirect('/login')
  }

  const [profile, user] = await Promise.all([
    prisma.clientProfile.findUniqueOrThrow({
      where: { user_id: session.user.id },
    }),
    prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { id: true, name: true, nickname: true, avatar_url: true },
    }),
  ])

  return (
    <div className="p-6 lg:p-10 max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Mi perfil</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Personaliza tus intereses y activa herramientas para emprendedores.
        </p>
      </div>

      <div className="rounded-card border border-kuska-border bg-white p-6">
        <p className="mb-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">
          Foto de perfil
        </p>
        <AvatarUploader userId={user.id} name={user.name} initialUrl={user.avatar_url} accent="red" />
        <div className="mt-5 border-t border-kuska-border pt-5">
          <NicknameField initialNickname={user.nickname} />
        </div>
      </div>

      <ClientProfileForm profile={profile} />
    </div>
  )
}
