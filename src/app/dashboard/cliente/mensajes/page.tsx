import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { Inbox } from '@/components/chat/Inbox'

export default async function ClientMessagesPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'cliente') {
    redirect('/login')
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="mb-4 font-display text-2xl font-bold text-kuska-text">Mensajes</h1>
      <Inbox currentUserId={session.user.id} basePath="/dashboard/cliente/mensajes" />
    </div>
  )
}
