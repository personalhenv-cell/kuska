import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ToggleActiveButton } from './ToggleActiveButton'

export default async function AdminUsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' },
    take: 200,
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
      is_active: true,
      created_at: true,
    },
  })

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-kuska-text">Usuarios</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">{users.length} cuentas registradas.</p>
      </div>
      <div className="overflow-x-auto rounded-card border border-kuska-border bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-kuska-border bg-kuska-cream/60">
            <tr>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Nombre</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Contacto</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Rol</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Registrado</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-kuska-border transition-colors last:border-0 hover:bg-kuska-cream/40">
                <td className="px-4 py-3 font-body text-sm text-kuska-text">{u.name}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">
                  {u.phone}{u.email ? ` · ${u.email}` : ''}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-kuska-gold/15 px-2.5 py-1 font-nunito text-xs font-bold uppercase text-kuska-brown">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{formatDate(u.created_at)}</td>
                <td className="px-4 py-3">
                  <ToggleActiveButton userId={u.id} isActive={u.is_active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
