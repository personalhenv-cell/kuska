import { Kusi } from '@/components/ui/Kusi'

export default function ArtisanMessagesPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <Kusi size="lg" animation="think" />
      <h1 className="font-display text-2xl font-bold text-kuska-text">Chat en tiempo real — próximamente</h1>
      <p className="max-w-md font-body text-sm text-kuska-text-mid">
        Estamos construyendo la mensajería en vivo entre artesanos y clientes.
        Muy pronto podrás conversar directamente desde aquí.
      </p>
    </div>
  )
}
