import { Metadata } from 'next'
import { Contactanos } from '@/components/contactanos/Contactanos'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Contáctanos',
  description:
    'Ponte en contacto con el equipo de Kuska y Agencia CEIPE. Estamos aquí para ayudarte con cualquier pregunta sobre nuestra plataforma de innovación artesanal.',
  openGraph: {
    title: 'Contáctanos · Kuska',
    description:
      'Ponte en contacto con el equipo de Kuska y Agencia CEIPE.',
  },
}

export default function ContactanosPage() {
  return (
    <>
      <Navbar />
      <Contactanos />
      <Footer />
    </>
  )
}
