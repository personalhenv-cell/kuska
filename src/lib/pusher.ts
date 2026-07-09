import PusherServer from 'pusher'

const globalForPusher = globalThis as unknown as {
  pusherServer: PusherServer | undefined
}

export const pusherServer =
  globalForPusher.pusherServer ??
  new PusherServer({
    appId: process.env.PUSHER_APP_ID ?? '',
    key: process.env.PUSHER_KEY ?? '',
    secret: process.env.PUSHER_SECRET ?? '',
    cluster: process.env.PUSHER_CLUSTER ?? '',
    useTLS: true,
  })

if (process.env.NODE_ENV !== 'production') globalForPusher.pusherServer = pusherServer

/** Nombre de canal privado determinista para una conversación 1:1. */
export function conversationChannel(userIdA: string, userIdB: string): string {
  const [a, b] = [userIdA, userIdB].sort()
  return `private-conversation-${a}-${b}`
}

/** Nombre de canal privado para el chat de un grupo de artesanos (Red Agrupación). */
export function groupChannel(groupId: string): string {
  return `private-group-${groupId}`
}

/** Canal privado personal — notifica a la bandeja de entrada de un usuario
 * que una de sus conversaciones cambió (mensaje nuevo enviado o recibido),
 * para refrescar la lista en tiempo real sin esperar a recargar la página. */
export function inboxChannel(userId: string): string {
  return `private-inbox-${userId}`
}
