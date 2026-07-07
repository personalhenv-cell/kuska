'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useSession } from 'next-auth/react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID

declare global {
  interface Window {
    OneSignalDeferred?: ((OneSignal: {
      login: (externalId: string) => Promise<void>
      logout: () => Promise<void>
    }) => void | Promise<void>)[]
  }
}

/** Registra el service worker para soporte PWA (offline + instalable). */
function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
}

/** Asocia la suscripción push de este navegador con el user.id de Kuska
 *  (OneSignal External ID) — sin esto, el envío server-side no tiene
 *  forma de saber a qué suscripción real corresponde cada usuario. */
function useOneSignalIdentity() {
  const { data: session } = useSession()
  useEffect(() => {
    if (!ONESIGNAL_APP_ID) return
    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async (OneSignal) => {
      if (session?.user.id) {
        await OneSignal.login(session.user.id)
      } else {
        await OneSignal.logout()
      }
    })
  }, [session?.user.id])
}

export function Integrations() {
  useServiceWorker()
  useOneSignalIdentity()

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
      {ONESIGNAL_APP_ID && (
        <>
          <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" defer />
          <Script id="onesignal-init" strategy="afterInteractive">
            {`
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                await OneSignal.init({ appId: "${ONESIGNAL_APP_ID}" });
              });
            `}
          </Script>
        </>
      )}
    </>
  )
}
