import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWorkshopReminderEmail } from '@/lib/resend'
import { sendPushToUser } from '@/lib/onesignal'

/**
 * Cron diario (ver vercel.json) — recordatorio a inscritos de talleres que
 * son "mañana". Ventana de 20-28h en vez de un flag reminder_sent en DB:
 * con cadencia diaria, cada taller cae en la ventana una sola vez sin
 * necesitar una migración de schema para marcarlo como ya notificado.
 */
export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const now = Date.now()
  const from = new Date(now + 20 * 60 * 60 * 1000)
  const to = new Date(now + 28 * 60 * 60 * 1000)

  const workshops = await prisma.workshop.findMany({
    where: { date: { gte: from, lt: to } },
    include: {
      artisan: { select: { user: { select: { name: true } } } },
      participants: { select: { user_id: true } },
    },
  })

  const userIds = [...new Set(workshops.flatMap((w) => w.participants.map((p) => p.user_id)))]
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } })
    : []
  const userById = new Map(users.map((u) => [u.id, u]))

  let notified = 0
  for (const w of workshops) {
    const when = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit',
    }).format(w.date)

    const joinInfo = w.is_virtual
      ? w.meeting_url
        ? `Videollamada: ${w.meeting_url}`
        : 'El enlace de videollamada aparecerá en la plataforma antes del taller.'
      : `Presencial: ${w.location ?? 'consulta la dirección en Kuska'}`

    for (const p of w.participants) {
      const user = userById.get(p.user_id)
      if (!user) continue

      await sendWorkshopReminderEmail({
        to: user.email,
        name: user.name,
        workshopTitle: w.title,
        when,
        joinInfo,
      })
      await sendPushToUser({
        userId: user.id,
        title: `Mañana: ${w.title}`,
        message: `Tu taller con ${w.artisan.user.name} es ${when}`,
        url: '/dashboard/cliente/talleres',
      }).catch(() => {})
      notified++
    }
  }

  return NextResponse.json({ ok: true, workshops: workshops.length, notified })
}
