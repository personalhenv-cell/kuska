import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ActiveToggle } from './ActiveToggle'
import { NewFairForm } from './NewFairForm'

export default async function AdminFeriasPage() {
  const fairs = await prisma.digitalFair.findMany({
    orderBy: { start_date: 'desc' },
    include: { _count: { select: { participants: true } } },
  })

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Ferias Digitales</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">{fairs.length} ferias creadas.</p>
      </div>

      <NewFairForm />

      <div className="overflow-x-auto rounded-card border border-kuska-border bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-kuska-border bg-kuska-cream/60">
            <tr>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Feria</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Tema</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Fechas</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Participantes</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Estado</th>
            </tr>
          </thead>
          <tbody>
            {fairs.map((f) => (
              <tr key={f.id} className="border-b border-kuska-border transition-colors last:border-0 hover:bg-kuska-cream/40">
                <td className="px-4 py-3 font-body text-sm text-kuska-text">{f.title}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{f.theme}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">
                  {formatDate(f.start_date)} – {formatDate(f.end_date)}
                </td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{f._count.participants}</td>
                <td className="px-4 py-3">
                  <ActiveToggle fairId={f.id} isActive={f.is_active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
