import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { ArtisanSidebar } from './components/ArtisanSidebar'

export default async function ArtisanDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano') redirect('/login')

  return (
    <div className="flex min-h-screen bg-kuska-cream">
      <ArtisanSidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
