import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/auth/config'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'
import { BusinessPlanGenerator } from './BusinessPlanGenerator'

export default async function EmprendedorPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') {
    redirect('/login')
  }

  if (!session.user.is_entrepreneur) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <Kusi size="lg" expression="dudoso" />
        <h1 className="font-display text-2xl font-bold text-kuska-text">Emprendedor IA es para clientes emprendedores</h1>
        <p className="max-w-md font-body text-sm text-kuska-text-mid">
          Activa &ldquo;¿Eres emprendedor?&rdquo; desde tu perfil para desbloquear el generador de planes de negocio
          con IA y el Hub de Capitalización.
        </p>
        <Link href="/dashboard/cliente/perfil">
          <Button variant="primary" size="lg">Ir a mi perfil</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Emprendedor IA</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Genera tu plan de negocio con IA y descárgalo en PDF.
        </p>
      </div>
      <BusinessPlanGenerator />
    </div>
  )
}
