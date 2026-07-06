import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'
import { formatPrice, formatDate } from '@/lib/utils'
import { ApplyButton } from './ApplyButton'

export default async function ClientCapitalizacionPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') {
    redirect('/login')
  }

  if (!session.user.is_entrepreneur) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <Kusi size="lg" expression="dudoso" />
        <h1 className="font-display text-2xl font-bold text-kuska-text">El Hub de Capitalización es para emprendedores</h1>
        <p className="max-w-md font-body text-sm text-kuska-text-mid">
          Activa &ldquo;¿Eres emprendedor?&rdquo; desde tu perfil para ver y postular a fondos reales de financiamiento.
        </p>
        <Link href="/dashboard/cliente/perfil">
          <Button variant="primary" size="lg">Ir a mi perfil</Button>
        </Link>
      </div>
    )
  }

  const clientProfile = await prisma.clientProfile.findUniqueOrThrow({
    where: { user_id: session.user.id },
    select: { id: true },
  })

  const funds = await prisma.fundOpportunity.findMany({
    where: { is_active: true, deadline: { gte: new Date() } },
    orderBy: { deadline: 'asc' },
    include: { applications: { where: { client_id: clientProfile.id } } },
  })

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Hub de Capitalización</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Fondos y convocatorias reales para hacer crecer tu emprendimiento.
        </p>
      </div>

      {funds.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <span className="text-4xl">💰</span>
          <p className="mt-3 font-body text-kuska-text-mid">No hay convocatorias activas en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {funds.map((f) => (
            <div key={f.id} className="rounded-card border border-kuska-border bg-white p-6">
              <h2 className="font-display text-lg font-bold text-kuska-text">{f.title}</h2>
              <p className="mt-1 font-body text-sm text-kuska-text-mid">{f.institution}</p>
              <p className="mt-2 font-display text-2xl font-bold text-kuska-teal">{formatPrice(f.amount)}</p>
              <p className="mt-1 font-body text-xs text-kuska-text-mid">Vence: {formatDate(f.deadline)}</p>
              {f.requirements.length > 0 && (
                <ul className="mt-3 space-y-1 font-body text-xs text-kuska-text-mid">
                  {f.requirements.map((r) => <li key={r}>• {r}</li>)}
                </ul>
              )}
              <div className="mt-4">
                <ApplyButton opportunityId={f.id} alreadyApplied={f.applications.length > 0} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
