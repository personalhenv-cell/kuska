'use client'

import { useEffect } from 'react'
import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID

/** Registra el service worker para soporte PWA (offline + instalable). */
function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
}

export function Integrations() {
  useServiceWorker()

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
