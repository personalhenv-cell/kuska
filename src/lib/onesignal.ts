const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY

interface PushPayload {
  /** user.id de Kuska — debe coincidir con el External ID asociado en el cliente (OneSignal.login). */
  userId: string
  title: string
  message: string
  url?: string
}

/**
 * Envía un push real a un usuario específico por su External ID.
 * Si falta ONESIGNAL_API_KEY (no configurada aún), no lanza — solo lo
 * registra, igual que el patrón ya usado para Kuska IA sin GEMINI_API_KEY:
 * una integración no configurada no debe romper el flujo que la dispara
 * (confirmar un pedido no debe fallar porque el push no se pudo enviar).
 */
export async function sendPushToUser({ userId, title, message, url }: PushPayload): Promise<{ ok: boolean }> {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
    console.warn('[onesignal] no configurado — falta ONESIGNAL_API_KEY, push no enviado:', title)
    return { ok: false }
  }

  try {
    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Basic ${ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        include_aliases: { external_id: [userId] },
        target_channel: 'push',
        headings: { en: title, es: title },
        contents: { en: message, es: message },
        ...(url ? { url } : {}),
      }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[onesignal] error HTTP:', res.status, text)
      return { ok: false }
    }
    return { ok: true }
  } catch (e) {
    console.error('[onesignal] error de red:', e instanceof Error ? e.message : e)
    return { ok: false }
  }
}
