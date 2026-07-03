import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { NewProductForm } from './NewProductForm'

export default async function NewProductPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Nuevo producto</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Publica una pieza real en el marketplace de Kuska.
        </p>
      </div>
      <NewProductForm />
    </div>
  )
}
