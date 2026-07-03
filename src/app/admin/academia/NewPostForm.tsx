'use client'

import { useRef, useState } from 'react'
import { createBlogPost } from './actions'

const INPUT_CLASS =
  'w-full rounded-btn border border-kuska-border bg-white px-4 py-3 font-body text-kuska-text focus:border-kuska-gold focus:outline-none focus:ring-2 focus:ring-kuska-gold/30 transition-all'

export function NewPostForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [saving, setSaving] = useState(false)

  async function action(formData: FormData) {
    setSaving(true)
    try {
      await createBlogPost(formData)
      formRef.current?.reset()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-card border border-kuska-border bg-white p-6">
      <h2 className="font-display text-lg font-bold text-kuska-text">Nueva lección/artículo</h2>
      <input name="title" placeholder="Título" required className={INPUT_CLASS} />
      <input name="author" placeholder="Autor" required className={INPUT_CLASS} />
      <textarea name="excerpt" placeholder="Resumen corto (aparece en la lista)" required className={`${INPUT_CLASS} h-16 resize-none`} />
      <textarea name="content" placeholder="Contenido completo" required className={`${INPUT_CLASS} h-40 resize-none`} />
      <input name="tags" placeholder="Etiquetas separadas por coma (ej: precios, fotografía)" className={INPUT_CLASS} />
      <button
        type="submit"
        disabled={saving}
        className="rounded-btn bg-kuska-red px-5 py-2.5 font-body text-sm font-bold text-white disabled:opacity-50"
      >
        {saving ? 'Publicando…' : 'Publicar'}
      </button>
    </form>
  )
}
