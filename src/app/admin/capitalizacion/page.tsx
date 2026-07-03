import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import { ActiveToggle } from './ActiveToggle'
import { NewFundForm } from './NewFundForm'
import { ApplicationStatusSelect } from './ApplicationStatusSelect'

export default async function AdminCapitalizacionPage() {
  const funds = await prisma.fundOpportunity.findMany({
    orderBy: { deadline: 'asc' },
    include: {
      applications: {
        include: { artisan: { include: { user: { select: { name: true } } } } },
      },
    },
  })

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Hub de Capitalización</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">{funds.length} convocatorias.</p>
      </div>

      <NewFundForm />

      <div className="space-y-4">
        {funds.map((f) => (
          <div key={f.id} className="rounded-card border border-kuska-border bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-kuska-text">{f.title}</h2>
                <p className="font-body text-sm text-kuska-text-mid">
                  {f.institution} · {formatPrice(f.amount)} · vence {formatDate(f.deadline)}
                </p>
              </div>
              <ActiveToggle fundId={f.id} isActive={f.is_active} />
            </div>

            {f.applications.length > 0 && (
              <div className="mt-4 overflow-x-auto border-t border-kuska-border pt-3">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-1.5 font-nunito text-xs font-bold uppercase text-kuska-text-mid">Artesano</th>
                      <th className="py-1.5 font-nunito text-xs font-bold uppercase text-kuska-text-mid">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {f.applications.map((a) => (
                      <tr key={a.id}>
                        <td className="py-1.5 font-body text-sm text-kuska-text">{a.artisan.user.name}</td>
                        <td className="py-1.5">
                          <ApplicationStatusSelect applicationId={a.id} status={a.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
