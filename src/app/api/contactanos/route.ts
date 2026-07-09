import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional().default(''),
  message: z.string().min(10).max(5000),
  subject: z.string().optional().default('Consulta desde Kuska'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = ContactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const { name, email, phone, message, subject } = parsed.data

    // Store in database
    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        message,
        subject,
      },
    })

    // Send emails using Resend (fire and forget)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      // Send email to CEIPE
      await resend.emails.send({
        from: 'Kuska <noreply@kuska-cyan.vercel.app>',
        to: 'contacto.ceipe@gmail.com',
        subject: `${subject} - De: ${name}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
          <p><strong>Asunto:</strong> ${subject}</p>
          <hr />
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        replyTo: email,
      }).catch(() => {})

      // Send confirmation to user
      await resend.emails.send({
        from: 'Kuska <noreply@kuska-cyan.vercel.app>',
        to: email,
        subject: 'Recibimos tu mensaje · Kuska',
        html: `
          <h2>¡Hola ${name}!</h2>
          <p>Recibimos tu mensaje y nos pondremos en contacto pronto.</p>
          <p><strong>Detalles de tu mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr />
          <p>Saludos,<br />El equipo de Kuska 🦙</p>
        `,
      }).catch(() => {})
    }

    return NextResponse.json({
      ok: true,
      contact: {
        id: contact.id,
        name: contact.name,
      },
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Error al procesar tu mensaje' },
      { status: 500 }
    )
  }
}
