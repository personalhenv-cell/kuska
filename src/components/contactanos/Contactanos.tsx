'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'

type KusiAnimation = 'idle' | 'think' | 'celebrate' | 'sleep'

export function Contactanos() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [kusiAnimation, setKusiAnimation] = useState<KusiAnimation>('idle')

  const handleFocus = () => setKusiAnimation('think')
  const handleBlur = () => setKusiAnimation('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setKusiAnimation('think')

    try {
      const res = await fetch('/api/contactanos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al enviar el mensaje')
        setKusiAnimation('idle')
        return
      }

      setKusiAnimation('celebrate')
      setSubmitted(true)
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')

      setTimeout(() => setKusiAnimation('idle'), 2500)
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
      setKusiAnimation('idle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-kuska-cream">
      {/* Header */}
      <div className="bg-gradient-to-b from-kuska-brown to-kuska-brown/95 px-6 py-12 text-kuska-cream">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Contáctanos
          </h1>
          <p className="mt-3 font-body text-lg text-kuska-cream/80">
            ¿Preguntas sobre Kuska? Nos encantaría saber de ti. Escríbenos y nos pondremos en contacto lo antes posible.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-kuska-text">
                Agencia CEIPE
              </h2>
              <p className="mt-2 font-body text-kuska-text-mid">
                El equipo detrás de Kuska. Somos una agencia de innovación artesanal comprometida con el desarrollo del Perú.
              </p>
            </div>

            {/* CEIPE Logo */}
            <div className="rounded-2xl border border-kuska-border bg-white p-8">
              <div className="flex h-32 items-center justify-center bg-kuska-cream/50 rounded-lg">
                <div className="text-center">
                  <p className="font-nunito text-sm font-bold uppercase tracking-wider text-kuska-teal">
                    Agencia
                  </p>
                  <p className="font-display text-3xl font-bold text-kuska-brown">
                    CEIPE
                  </p>
                </div>
              </div>
              <p className="mt-4 text-center font-body text-sm text-kuska-text-mid">
                Centro de Excelencia en Innovación del Perú
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="rounded-glass border border-kuska-border bg-white p-6">
                <h3 className="font-nunito text-sm font-bold uppercase tracking-wide text-kuska-teal">
                  Email
                </h3>
                <a
                  href="mailto:contacto.ceipe@gmail.com"
                  className="mt-2 block font-body text-lg font-semibold text-kuska-brown hover:text-kuska-gold transition-colors"
                >
                  contacto.ceipe@gmail.com
                </a>
              </div>

              <div className="rounded-glass border border-kuska-border bg-white p-6">
                <h3 className="font-nunito text-sm font-bold uppercase tracking-wide text-kuska-teal">
                  Teléfono (CEO)
                </h3>
                <a
                  href="tel:908915629"
                  className="mt-2 block font-body text-lg font-semibold text-kuska-brown hover:text-kuska-gold transition-colors"
                >
                  908 915 629
                </a>
              </div>

              <div className="rounded-glass border border-kuska-border bg-white p-6">
                <h3 className="font-nunito text-sm font-bold uppercase tracking-wide text-kuska-teal">
                  Sitio Web
                </h3>
                <a
                  href="https://sites.google.com/view/agencia-ceipe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block font-body text-lg font-semibold text-kuska-brown hover:text-kuska-gold transition-colors"
                >
                  sites.google.com/view/agencia-ceipe →
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="rounded-glass border border-kuska-border bg-white p-8">
              {/* Kusi Mascot */}
              <div className="mb-6 flex justify-center">
                <Kusi size="md" animation={kusiAnimation} />
              </div>

              {submitted ? (
                <div className="space-y-4 text-center py-8">
                  <div className="text-5xl">✨</div>
                  <h3 className="font-display text-2xl font-bold text-kuska-text">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="font-body text-kuska-text-mid">
                    Gracias por contactarnos. Te responderemos en breve.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-block rounded-btn bg-kuska-teal px-6 py-2 font-body text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-teal">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="Tu nombre"
                      className="mt-2 w-full rounded-btn border border-kuska-border px-4 py-2.5 font-body text-sm focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-teal">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="tu@email.com"
                      className="mt-2 w-full rounded-btn border border-kuska-border px-4 py-2.5 font-body text-sm focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-teal">
                      Teléfono (opcional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="123 456 7890"
                      className="mt-2 w-full rounded-btn border border-kuska-border px-4 py-2.5 font-body text-sm focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-nunito text-xs font-bold uppercase tracking-wide text-kuska-teal">
                      Mensaje
                    </label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="Cuéntanos qué necesitas..."
                      rows={6}
                      className="mt-2 w-full rounded-btn border border-kuska-border px-4 py-2.5 font-body text-sm focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-sm font-body text-kuska-red">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-btn bg-kuska-red px-6 py-3 font-body text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                  </button>
                </form>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-6 rounded-glass border border-kuska-border bg-kuska-cream p-6">
              <p className="font-body text-sm text-kuska-text-mid">
                <strong>Nota:</strong> También puedes enviarnos un mensaje directo a través de WhatsApp al número que aparece arriba, o visitarnos en nuestro sitio web.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
