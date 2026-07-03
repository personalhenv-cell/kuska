import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Red Cuéntame — La comunidad de Kuska',
  description: 'Historias, avances de taller y voces de los artesanos del Perú.',
}

export default async function ComunidadPublicaPage() {
  const now = new Date()
  const posts = await prisma.post.findMany({
    where: { OR: [{ expires_at: null }, { expires_at: { gt: now } }] },
    orderBy: { created_at: 'desc' },
    take: 30,
    include: {
      author: { select: { name: true, role: true } },
      _count: { select: { reactions: true, comments: true } },
    },
  })

  return (
    <div className="min-h-screen bg-kuska-cream">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-gold">Comunidad Kuska</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-kuska-text">Red Cuéntame</h1>
        <p className="mt-2 font-body text-kuska-text-mid">
          Historias, avances de taller y la voz de los artesanos del Perú.
        </p>

        <Link
          href="/registro"
          className="mt-5 inline-block rounded-input bg-kuska-red px-5 py-2.5 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Únete y comparte tu historia
        </Link>

        {posts.length === 0 ? (
          <div className="mt-8 rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
            <span className="text-4xl">🗣️</span>
            <p className="mt-3 font-body text-kuska-text-mid">Aún no hay publicaciones. ¡Sé el primero en contar tu historia!</p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {posts.map((p) => (
              <article key={p.id} className="rounded-card border border-kuska-border bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kuska-teal/15 font-display text-sm font-bold text-kuska-teal">
                    {p.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-kuska-text">{p.author.name}</p>
                    <p className="font-nunito text-xs text-kuska-text-mid">
                      {p.author.role === 'artesano' ? '🎨 Artesano' : '💛 Cliente'} · {formatDate(p.created_at)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-line font-body text-kuska-text">{p.content}</p>

                {p.images[0] && (
                  <div className="relative mt-3 h-64 w-full overflow-hidden rounded-card">
                    <Image src={p.images[0]} alt="" fill className="object-cover" />
                  </div>
                )}

                <div className="mt-3 flex items-center gap-4 font-nunito text-xs text-kuska-text-mid">
                  <span>❤️ {p._count.reactions}</span>
                  <span>💬 {p._count.comments}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
