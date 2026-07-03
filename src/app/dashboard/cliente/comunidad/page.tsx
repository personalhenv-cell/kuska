import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { RedCuentame } from '@/components/comunidad/RedCuentame'

export default async function ComunidadPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') redirect('/login')

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Red Cuéntame</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Comparte tu experiencia con el arte peruano y conecta con la comunidad Kuska.
        </p>
      </div>
      <RedCuentame />
    </div>
  )
}
