import Link from 'next/link'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-kuska-cream px-6 text-center">
      <Kusi size="lg" animation="think" message="Kusi también está perdido 🦙" />
      <h1 className="mt-6 font-display text-6xl font-bold text-kuska-text">
        404
      </h1>
      <p className="mt-2 max-w-md font-body text-lg text-kuska-text-mid">
        No encontramos esta página. Quizás se fue de feria por los Andes.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="primary" size="lg">
          Volver al inicio
        </Button>
      </Link>
    </main>
  )
}
