import { Resend } from 'resend'

let resendClient: Resend | undefined

/** Se crea solo cuando hay API key y solo al primer uso — el constructor de
 *  Resend lanza si la key falta, y no queremos que eso rompa el build ni
 *  otras rutas que importan este módulo. */
function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY)
  return resendClient
}

const FROM = 'Kuska <onboarding@resend.dev>'

/**
 * Envía el email de bienvenida. No lanza si falla — el registro no debe
 * romperse por un problema de email de cortesía (el canal crítico es el OTP,
 * ver `sendOtpEmail`).
 */
export async function sendWelcomeEmail(params: {
  to: string | null | undefined
  name: string
  role: 'artesano' | 'cliente'
}): Promise<void> {
  if (!params.to) return
  const client = getResendClient()
  if (!client) return

  const roleCopy =
    params.role === 'artesano'
      ? {
          subject: '¡Bienvenido a Kuska! Tu taller ya está en línea 🦙',
          heading: '¡Tu arte ya tiene un hogar en Kuska!',
          body: 'Tu cuenta de artesano está lista. Sube tus primeras piezas, cuenta tu historia y empieza a llegar a clientes de todo el Perú y el mundo.',
          ctaLabel: 'Ir a mi panel',
          ctaHref: 'https://kuska-cyan.vercel.app/dashboard/artesano',
        }
      : {
          subject: '¡Bienvenido a Kuska! 🦙',
          heading: '¡Gracias por unirte a Kuska!',
          body: 'Descubre piezas artesanales únicas hechas a mano por maestros de todo el Perú. Cada compra apoya directamente a una familia artesana.',
          ctaLabel: 'Explorar marketplace',
          ctaHref: 'https://kuska-cyan.vercel.app/marketplace',
        }

  try {
    await client.emails.send({
      from: FROM,
      to: params.to,
      subject: roleCopy.subject,
      html: `
        <div style="font-family: Georgia, serif; background:#F5F0E8; padding:32px; color:#1A0A00;">
          <div style="max-width:480px; margin:0 auto; background:#FFFFFF; border-radius:20px; padding:32px; border:1px solid rgba(61,28,2,0.12);">
            <p style="font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#D4920A; font-weight:bold; margin:0 0 8px;">Kuska</p>
            <h1 style="font-size:24px; margin:0 0 16px;">${roleCopy.heading}</h1>
            <p style="font-size:15px; line-height:1.6; color:#6B4C35; margin:0 0 24px;">
              Hola ${params.name}, ${roleCopy.body}
            </p>
            <a href="${roleCopy.ctaHref}" style="display:inline-block; background:#C84B2F; color:#FFFFFF; text-decoration:none; padding:12px 24px; border-radius:12px; font-weight:bold; font-size:14px;">
              ${roleCopy.ctaLabel}
            </a>
          </div>
        </div>
      `,
    })
  } catch {
    // El registro ya se completó exitosamente en la DB — un fallo de email
    // no debe convertirse en un error 500 para el usuario.
  }
}

/**
 * Envía el código OTP por correo — hoy es el único canal de entrega real
 * (no hay proveedor de SMS/WhatsApp en el stack). A diferencia del email de
 * bienvenida, un fallo aquí SÍ se reporta al llamador: sin este correo el
 * usuario no tiene forma de iniciar sesión.
 */
export async function sendOtpEmail(params: {
  to: string
  name: string
  code: string
}): Promise<{ ok: boolean; error?: string }> {
  const client = getResendClient()
  if (!client) {
    console.error('[sendOtpEmail] RESEND_API_KEY no configurada')
    return { ok: false, error: 'RESEND_API_KEY no configurada' }
  }

  try {
    const { error } = await client.emails.send({
      from: FROM,
      to: params.to,
      subject: `${params.code} — Tu código de acceso a Kuska`,
      html: `
        <div style="font-family: Georgia, serif; background:#F5F0E8; padding:32px; color:#1A0A00;">
          <div style="max-width:480px; margin:0 auto; background:#FFFFFF; border-radius:20px; padding:32px; border:1px solid rgba(61,28,2,0.12); text-align:center;">
            <p style="font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#D4920A; font-weight:bold; margin:0 0 8px;">Kuska</p>
            <h1 style="font-size:20px; margin:0 0 16px;">Hola ${params.name}, este es tu código</h1>
            <p style="font-size:36px; font-weight:bold; letter-spacing:0.3em; color:#C84B2F; margin:0 0 16px;">${params.code}</p>
            <p style="font-size:14px; line-height:1.6; color:#6B4C35; margin:0;">
              Vence en 5 minutos. Si no lo solicitaste, ignora este correo.
            </p>
          </div>
        </div>
      `,
    })
    if (error) {
      console.error('[sendOtpEmail] Resend API error:', JSON.stringify(error))
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (e) {
    console.error('[sendOtpEmail] excepción:', e instanceof Error ? e.message : e)
    return { ok: false, error: e instanceof Error ? e.message : 'Error desconocido al enviar' }
  }
}

/** Recordatorio de taller — no reporta fallo al llamador: el cron sigue
 *  con el resto de inscritos aunque uno falle (mismo criterio que el
 *  email de bienvenida, cortesía y no bloqueante). */
export async function sendWorkshopReminderEmail(params: {
  to: string | null | undefined
  name: string
  workshopTitle: string
  when: string
  joinInfo: string
}): Promise<void> {
  if (!params.to) return
  const client = getResendClient()
  if (!client) return

  try {
    await client.emails.send({
      from: FROM,
      to: params.to,
      subject: `Mañana: "${params.workshopTitle}" — Kuska`,
      html: `
        <div style="font-family: Georgia, serif; background:#F5F0E8; padding:32px; color:#1A0A00;">
          <div style="max-width:480px; margin:0 auto; background:#FFFFFF; border-radius:20px; padding:32px; border:1px solid rgba(61,28,2,0.12);">
            <p style="font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:#D4920A; font-weight:bold; margin:0 0 8px;">Kuska · Recordatorio</p>
            <h1 style="font-size:22px; margin:0 0 16px;">${params.workshopTitle}</h1>
            <p style="font-size:15px; line-height:1.6; color:#6B4C35; margin:0 0 12px;">
              Hola ${params.name}, tu taller es mañana, ${params.when}.
            </p>
            <p style="font-size:14px; line-height:1.6; color:#3D1C02; margin:0 0 20px; background:#F5F0E8; padding:12px 16px; border-radius:12px;">
              ${params.joinInfo}
            </p>
            <a href="https://kuska-cyan.vercel.app/dashboard/cliente/talleres" style="display:inline-block; background:#C84B2F; color:#FFFFFF; text-decoration:none; padding:12px 24px; border-radius:12px; font-weight:bold; font-size:14px;">
              Ver mis talleres
            </a>
          </div>
        </div>
      `,
    })
  } catch {
    // No bloquea el resto de recordatorios del cron.
  }
}
