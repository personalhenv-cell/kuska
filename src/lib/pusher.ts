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
