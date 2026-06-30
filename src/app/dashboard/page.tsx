import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  if (session.user.role === 'artesano') redirect('/dashboard/artesano')
  if (session.user.role === 'admin') redirect('/admin')
  redirect('/dashboard/cliente')
}
