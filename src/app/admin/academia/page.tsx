import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { PublishToggle } from './PublishToggle'
import { NewPostForm } from './NewPostForm'

export default async function AdminAcademiaPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { created_at: 'desc' } })

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Academia Kuska</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">{posts.length} artículos/lecciones.</p>
      </div>

      <NewPostForm />

      <div className="overflow-x-auto rounded-card border border-kuska-border bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-kuska-border bg-kuska-cream/60">
            <tr>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Título</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Autor</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Vistas</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Fecha</th>
              <th className="px-4 py-3 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Estado</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-kuska-border last:border-0">
                <td className="px-4 py-3 font-body text-sm text-kuska-text">{p.title}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{p.author}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{p.views}</td>
                <td className="px-4 py-3 font-body text-sm text-kuska-text-mid">{formatDate(p.created_at)}</td>
                <td className="px-4 py-3">
                  <PublishToggle postId={p.id} isPublished={p.is_published} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
