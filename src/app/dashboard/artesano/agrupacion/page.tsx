import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { AgrupacionClient } from './AgrupacionClient'

export default async function AgrupacionPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano') redirect('/login')

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Red Agrupación</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Organízate con otros artesanos para ferias físicas — gratis en todos los planes.
        </p>
      </div>
      <AgrupacionClient />
    </div>
  )
}
