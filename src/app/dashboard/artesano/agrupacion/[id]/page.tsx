import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { GroupChat } from './GroupChat'

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano') redirect('/login')

  const group = await prisma.artisanGroup.findUnique({
    where: { id: params.id },
    include: { members: true },
  })
  if (!group) notFound()

  const isMember = group.members.some((m) => m.user_id === session.user.id)
  if (!isMember) {
    return (
      <div className="p-6 lg:p-10 text-center">
        <p className="font-body text-kuska-text-mid">Únete a este grupo desde Red Agrupación para ver su chat.</p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-1px)] flex-col p-6 lg:p-10">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-kuska-text">{group.name}</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">{group.members.length} miembros</p>
      </div>
      <GroupChat groupId={group.id} />
    </div>
  )
}
