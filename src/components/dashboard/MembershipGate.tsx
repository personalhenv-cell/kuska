import Link from 'next/link'
import { Kusi } from '@/components/ui/Kusi'
import { Button } from '@/components/ui/Button'
import { getPlan, type PlanId } from '@/lib/memberships'

interface MembershipGateProps {
  requiredPlan: PlanId
  featureName: string
}

/** Pantalla de upsell mostrada cuando el plan actual no incluye la función. */
export function MembershipGate({ requiredPlan, featureName }: MembershipGateProps) {
  const plan = getPlan(requiredPlan)
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <Kusi size="lg" animation="think" />
      <h1 className="font-display text-2xl font-bold text-kuska-text">
        {featureName} es parte de {plan?.name ?? requiredPlan}
      </h1>
      <p className="max-w-md font-body text-sm text-kuska-text-mid">
        Mejora tu plan para desbloquear esta herramienta y todo lo que incluye{' '}
        {plan?.name}.
      </p>
      <Link href="/precios">
        <Button variant="primary" size="lg">
          Ver planes desde S/ {plan?.price ?? ''}
        </Button>
      </Link>
    </div>
  )
}
