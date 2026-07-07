import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import QRCode from 'qrcode'
import { authOptions } from '@/auth/config'
import { prisma } from '@/lib/prisma'
import { updateArtisanProfile } from './actions'
import { SaveProfileButton } from './SaveProfileButton'
import { ShareQrCard } from './ShareQrCard'

const SITE_URL = 'https://kuska-cyan.vercel.app'

export default async function ArtisanProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'artesano' || !session.user.artisan_profile_id) {
    redirect('/login')
  }

  const profile = await prisma.artisanProfile.findUniqueOrThrow({
    where: { id: session.user.artisan_profile_id },
  })

  const publicProfileUrl = `${SITE_URL}/artesano/${profile.id}`
  const qrDataUrl = await QRCode.toDataURL(publicProfileUrl, {
    width: 320,
    margin: 1,
    color: { dark: '#3D1C02', light: '#F5F0E8' },
  })

  const inputClass =
    'w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'
  const labelClass = 'block mb-1.5 font-nunito text-xs font-bold uppercase tracking-wide text-kuska-text-mid'

  return (
    <div className="p-6 lg:p-10 max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-kuska-text">Mi perfil</h1>
        <p className="mt-1 font-body text-sm text-kuska-text-mid">
          Esta información aparece en tu tienda y le da confianza a tus clientes.
        </p>
      </div>

      <form action={updateArtisanProfile} className="space-y-5 rounded-card border border-kuska-border bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Especialidad</label>
            <input name="specialty" defaultValue={profile.specialty} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Técnica</label>
            <input name="technique" defaultValue={profile.technique} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Región</label>
            <input name="region" defaultValue={profile.region} className={inputClass} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>WhatsApp</label>
          <input
            name="whatsapp"
            defaultValue={profile.whatsapp?.replace(/^51/, '') ?? ''}
            placeholder="987 654 321"
            className={inputClass}
          />
          <p className="mt-1 font-body text-xs text-kuska-text-mid">
            Tu celular peruano — clientes y organizadores de talleres podrán escribirte directo por WhatsApp.
          </p>
        </div>

        <div>
          <label className={labelClass}>Biografía corta</label>
          <textarea
            name="bio"
            defaultValue={profile.bio ?? ''}
            maxLength={280}
            className={`${inputClass} h-20 resize-none`}
            placeholder="Una frase que te describa como artesano…"
          />
        </div>

        <div>
          <label className={labelClass}>Tu historia</label>
          <textarea
            name="story"
            defaultValue={profile.story ?? ''}
            className={`${inputClass} h-40 resize-none`}
            placeholder="Cuéntanos cómo aprendiste tu arte…"
          />
        </div>

        <SaveProfileButton />
      </form>

      <ShareQrCard qrDataUrl={qrDataUrl} profileUrl={publicProfileUrl} />
    </div>
  )
}
