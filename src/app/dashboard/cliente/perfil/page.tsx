import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { ClientProfileForm } from './ClientProfileForm'

export default async function ClientProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') {
    redirect('/login')
  }

  const profile = await prisma.clientProfile.findUniqueOrThrow({
    where: { user_id: session.user.id },
  })

  return (
    <div className="p-6 lg:p-10 max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Mi perfil</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Personaliza tus intereses y activa herramientas para emprendedores.
        </p>
      </div>

      <ClientProfileForm profile={profile} />
    </div>
  )
}
