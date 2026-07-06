import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { EntrepreneurGate } from '@/components/dashboard/EntrepreneurGate'
import { DashboardHero } from '@/components/dashboard/DashboardHero'
import { BusinessPlanGenerator } from './BusinessPlanGenerator'

export default async function EmprendedorPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') {
    redirect('/login')
  }

  if (!session.user.is_entrepreneur) {
    return (
      <EntrepreneurGate
        title="Emprendedor IA es para clientes emprendedores"
        description="Activa «¿Eres emprendedor?» desde tu perfil para desbloquear el generador de planes de negocio con IA y el Hub de Capitalización."
      />
    )
  }

  return (
    <div className="p-6 lg:p-10">
      <DashboardHero
        badge="🚀 Emprendedor IA"
        title="Convierte tu idea en un plan real"
        description="Genera tu plan de negocio con inteligencia artificial, descárgalo en PDF y postula al Hub de Capitalización cuando esté listo."
        kusiAnimation="celebrate"
      />
      <BusinessPlanGenerator />
    </div>
  )
}
