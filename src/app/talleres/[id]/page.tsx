import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatDate, formatPrice } from '@/lib/utils'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { EnrollButton } from './EnrollButton'

export const dynamic = 'force-dynamic'

export default async function TallerDetailPage({ params }: { params: { id: string } }) {
  const workshop = await prisma.workshop.findUnique({
    where: { id: params.id },
    include: {
      artisan: {
        select: {
          id: true, specialty: true, region: true, community: true, whatsapp: true,
          user: { select: { name: true } },
        },
      },
      _count: { select: { participants: true } },
    },
  })

  if (!workshop) notFound()

  const session = await getServerSession(authOptions)
  let alreadyEnrolled = false
  if (session) {
    const p = await prisma.workshopParticipant.findFirst({
      where: { workshop_id: workshop.id, user_id: session.user.id },
      select: { id: true },
    })
    alreadyEnrolled = Boolean(p)
  }

  const full = workshop._count.participants >= workshop.capacity
  const past = workshop.date < new Date()

  return (
    <div className="min-h-screen bg-kuska-cream">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-12 sm:pt-32">
        <Link href="/talleres" className="font-body text-sm text-kuska-text-mid hover:text-kuska-red">
          ← Todos los talleres
        </Link>

        <div className="mt-4 rounded-card border border-kuska-border bg-white p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-kuska-teal/10 px-2.5 py-0.5 font-nunito text-xs font-bold text-kuska-teal">
              {workshop.is_virtual ? '🌐 Virtual' : '📍 Presencial'}
            </span>
            <span className="rounded-full bg-kuska-gold/10 px-2.5 py-0.5 font-nunito text-xs font-bold text-kuska-gold">
              {workshop.price > 0 ? formatPrice(workshop.price) : 'Gratis'}
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold text-kuska-text">{workshop.title}</h1>

          <p className="mt-2 font-body text-sm text-kuska-text-mid">
            Dictado por{' '}
            <Link href={`/artesano/${workshop.artisan.id}`} className="font-semibold text-kuska-teal hover:underline">
              {workshop.artisan.user.name}
            </Link>{' '}
            · {workshop.artisan.specialty} · {workshop.artisan.community ? `${workshop.artisan.community}, ` : ''}{workshop.artisan.region}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 rounded-card bg-kuska-cream/60 p-4 sm:grid-cols-3">
            <div>
              <p className="font-nunito text-xs text-kuska-text-mid">Fecha</p>
              <p className="font-body text-sm font-semibold text-kuska-text">{formatDate(workshop.date)}</p>
            </div>
            <div>
              <p className="font-nunito text-xs text-kuska-text-mid">Cupos</p>
              <p className="font-body text-sm font-semibold text-kuska-text">
                {workshop._count.participants}/{workshop.capacity}
              </p>
            </div>
            <div>
              <p className="font-nunito text-xs text-kuska-text-mid">Modalidad</p>
              <p className="font-body text-sm font-semibold text-kuska-text">
                {workshop.is_virtual ? 'En línea' : 'Presencial'}
              </p>
            </div>
          </div>

          <p className="mt-5 whitespace-pre-line font-body leading-relaxed text-kuska-text">{workshop.description}</p>

          {!workshop.is_virtual && workshop.location && (
            <div className="mt-5 flex items-start gap-3 rounded-card border border-kuska-border bg-white p-4">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid">Dirección</p>
                <p className="mt-0.5 font-body text-sm text-kuska-text">{workshop.location}</p>
              </div>
            </div>
          )}

          {workshop.is_virtual && workshop.meeting_url && alreadyEnrolled && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-card border border-kuska-teal/30 bg-kuska-teal/5 p-4">
              <div>
                <p className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-teal">Ya estás inscrito</p>
                <p className="mt-0.5 font-body text-sm text-kuska-text">Únete a la videollamada el día del taller</p>
              </div>
              <a
                href={workshop.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 rounded-btn bg-kuska-teal px-4 py-2 font-body text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Ingresar →
              </a>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {!past && (
              <EnrollButton
                workshopId={workshop.id}
                title={workshop.title}
                date={workshop.date.toISOString()}
                price={workshop.price}
                isVirtual={workshop.is_virtual}
                full={full}
                alreadyEnrolled={alreadyEnrolled}
              />
            )}
            {workshop.artisan.whatsapp && (
              <WhatsAppButton
                phone={workshop.artisan.whatsapp}
                message={`Hola ${workshop.artisan.user.name}, vi tu taller "${workshop.title}" en Kuska y quisiera más información para agendarlo.`}
                label="Agendar por WhatsApp"
              />
            )}
          </div>

          {past && (
            <div className="mt-4 rounded-card border border-kuska-border bg-white px-5 py-3 text-center font-body text-kuska-text-mid">
              Este taller ya se realizó
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
