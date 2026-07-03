'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'
import { formatDate } from '@/lib/utils'

interface GroupItem {
  id: string
  name: string
  description: string | null
  region: string | null
  fair_date: string | null
  fair_location: string | null
  _count: { members: number }
}

const INPUT_CLASS =
  'w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'

export function AgrupacionClient() {
  const [groups, setGroups] = useState<GroupItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', region: '', fair_date: '', fair_location: '' })
  const [joiningId, setJoiningId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/grupos')
      const data: { groups: GroupItem[] } = await res.json()
      setGroups(data.groups ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function createGroup(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/grupos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ name: '', description: '', region: '', fair_date: '', fair_location: '' })
      setShowForm(false)
      await load()
    }
  }

  async function join(groupId: string) {
    setJoiningId(groupId)
    try {
      await fetch(`/api/grupos/${groupId}/join`, { method: 'POST' })
      await load()
    } finally {
      setJoiningId(null)
    }
  }

  return (
    <div className="space-y-6">
      <RippleButton>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancelar' : '+ Crear grupo'}
        </Button>
      </RippleButton>

      {showForm && (
        <form onSubmit={createGroup} className="space-y-3 rounded-card border border-kuska-border bg-white p-6">
          <input required placeholder="Nombre del grupo" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={INPUT_CLASS} />
          <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={`${INPUT_CLASS} h-20 resize-none`} />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Región" value={form.region} onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))} className={INPUT_CLASS} />
            <input type="date" value={form.fair_date} onChange={(e) => setForm((p) => ({ ...p, fair_date: e.target.value }))} className={INPUT_CLASS} />
          </div>
          <input placeholder="Lugar de la feria" value={form.fair_location} onChange={(e) => setForm((p) => ({ ...p, fair_location: e.target.value }))} className={INPUT_CLASS} />
          <button type="submit" className="rounded-btn bg-kuska-red px-5 py-2.5 font-body text-sm font-bold text-white">
            Crear
          </button>
        </form>
      )}

      {loading ? (
        <p className="font-body text-sm text-kuska-text-mid">Cargando grupos…</p>
      ) : groups.length === 0 ? (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-12 text-center">
          <span className="text-4xl">🤝</span>
          <p className="mt-3 font-body text-kuska-text-mid">Aún no hay grupos. Crea el primero.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.id} className="rounded-card border border-kuska-border bg-white p-5">
              <h3 className="font-display text-lg font-bold text-kuska-text">{g.name}</h3>
              {g.description && <p className="mt-1 font-body text-sm text-kuska-text-mid">{g.description}</p>}
              <p className="mt-2 font-body text-xs text-kuska-text-mid">
                {g.region ?? 'Sin región'} · {g._count.members} miembros
                {g.fair_date && ` · Feria: ${formatDate(g.fair_date)}`}
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => join(g.id)}
                  disabled={joiningId === g.id}
                  className="rounded-btn bg-kuska-teal px-4 py-2 font-body text-sm font-bold text-white disabled:opacity-50"
                >
                  {joiningId === g.id ? 'Uniéndote…' : 'Unirme'}
                </button>
                <Link
                  href={`/dashboard/artesano/agrupacion/${g.id}`}
                  className="rounded-btn border border-kuska-border px-4 py-2 font-body text-sm font-semibold text-kuska-text"
                >
                  Ver chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
