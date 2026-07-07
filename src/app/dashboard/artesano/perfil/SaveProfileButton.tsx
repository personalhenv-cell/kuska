'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'

export function SaveProfileButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Guardando…' : 'Guardar cambios'}
    </Button>
  )
}
