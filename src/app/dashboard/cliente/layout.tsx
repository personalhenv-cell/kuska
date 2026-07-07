import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { ClientSidebar } from './components/ClientSidebar'

export default async function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') redirect('/login')

  return (
    <div className="flex min-h-screen bg-kuska-cream">
      <ClientSidebar user={session.user} />
      {/* pt-14 compensa el header móvil fijo del DashboardNav (h-14, < lg). */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
