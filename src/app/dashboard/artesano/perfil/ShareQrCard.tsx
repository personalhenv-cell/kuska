'use client'

import { useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'

/** El QR apunta al perfil público (/artesano/[id]) — pensado para
 *  imprimir y usar en ferias físicas, junto a la mercadería. */
export function ShareQrCard({ qrDataUrl, profileUrl }: { qrDataUrl: string; profileUrl: string }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast.success('Enlace copiado')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  return (
    <div className="rounded-card border border-kuska-border bg-white p-6">
      <div className="flex items-center gap-2">
        <Icon name="qrcode" className="h-5 w-5 text-kuska-gold" />
        <h2 className="font-display text-lg font-bold text-kuska-text">Tu QR para ferias</h2>
      </div>
      <p className="mt-1 font-body text-sm text-kuska-text-mid">
        Imprímelo y ponlo junto a tu mercadería — quien lo escanee llega directo a tu perfil en Kuska.
      </p>

      <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="rounded-card border border-kuska-border bg-kuska-cream p-3">
          <Image src={qrDataUrl} alt="Código QR de tu perfil público" width={160} height={160} unoptimized />
        </div>

        <div className="flex flex-1 flex-col gap-2.5">
          <p className="break-all rounded-btn bg-kuska-cream px-3 py-2 font-mono text-xs text-kuska-text-mid">
            {profileUrl}
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a href={qrDataUrl} download="mi-qr-kuska.png">
              <Button variant="secondary" size="sm">
                <Icon name="download" className="h-4 w-4" />
                Descargar PNG
              </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={copyLink}>
              {copied ? '✓ Copiado' : 'Copiar enlace'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
