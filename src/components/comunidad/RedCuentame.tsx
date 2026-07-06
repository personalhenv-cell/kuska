'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { RippleButton } from '@/components/ui/RippleButton'

interface Author {
  id: string
  name: string
  avatar_url: string | null
  role: string
}

interface PostItem {
  id: string
  content: string
  images: string[]
  created_at: string
  author: Author
  reaction_count: number
  comment_count: number
  reacted_by_me: boolean
}

interface CommentItem {
  id: string
  content: string
  created_at: string
  author: { id: string; name: string; avatar_url: string | null } | null
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  return `hace ${Math.floor(hours / 24)} d`
}

function PostCard({ post, onReact }: { post: PostItem; onReact: (id: string) => void }) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  async function toggleComments() {
    setShowComments((prev) => !prev)
    if (!showComments && comments.length === 0) {
      setLoadingComments(true)
      try {
        const res = await fetch(`/api/posts/${post.id}/comments`)
        const data: { comments: CommentItem[] } = await res.json()
        setComments(data.comments ?? [])
      } finally {
        setLoadingComments(false)
      }
    }
  }

  async function submitComment() {
    if (!newComment.trim() || submittingComment) return
    setSubmittingComment(true)
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      })
      if (res.ok) {
        const data: { comment: { id: string; content: string; created_at: string } } = await res.json()
        setComments((prev) => [...prev, { ...data.comment, author: null }])
        setNewComment('')
      } else {
        toast.error('No se pudo publicar el comentario')
      }
    } catch {
      toast.error('Error de red. Intenta de nuevo.')
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
    <div className="rounded-card border border-kuska-border bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-kuska-cream-dark">
          {post.author.avatar_url ? (
            <Image src={post.author.avatar_url} alt={post.author.name} width={40} height={40} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display font-bold text-kuska-brown">
              {post.author.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-body text-sm font-semibold text-kuska-text">{post.author.name}</p>
          <p className="font-body text-xs text-kuska-text-mid">{timeAgo(post.created_at)}</p>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-line font-body text-sm text-kuska-text">{post.content}</p>

      {post.images.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {post.images.map((url, idx) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-btn">
              <Image src={url} alt={`Imagen del post por ${post.author.name} (${idx + 1})`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-kuska-border pt-3">
        <button
          onClick={() => onReact(post.id)}
          className={`font-body text-sm font-semibold transition-colors ${post.reacted_by_me ? 'text-kuska-red' : 'text-kuska-text-mid hover:text-kuska-red'}`}
        >
          {post.reacted_by_me ? '❤️' : '🤍'} {post.reaction_count}
        </button>
        <button onClick={toggleComments} className="font-body text-sm text-kuska-text-mid hover:text-kuska-text">
          💬 {post.comment_count}
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-2 border-t border-kuska-border pt-3">
          {loadingComments && <p className="font-body text-xs text-kuska-text-mid">Cargando…</p>}
          {comments.map((c) => (
            <div key={c.id} className="font-body text-sm text-kuska-text">
              <span className="font-semibold">{c.author?.name ?? 'Tú'}:</span> {c.content}
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder="Escribe un comentario…"
              disabled={submittingComment}
              className="flex-1 rounded-btn border border-kuska-border px-3 py-1.5 font-body text-sm focus:border-kuska-gold focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={submitComment}
              disabled={submittingComment || !newComment.trim()}
              className="font-body text-sm font-semibold text-kuska-red transition-opacity disabled:opacity-40"
            >
              {submittingComment ? 'Enviando…' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function RedCuentame() {
  const { data: authSession } = useSession()
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/posts')
      const data: { posts: PostItem[] } = await res.json()
      setPosts(data.posts ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function submitPost() {
    if (!newPost.trim()) return
    setPosting(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost, images: [] }),
      })
      if (res.ok) {
        setNewPost('')
        await loadPosts()
      }
    } finally {
      setPosting(false)
    }
  }

  async function react(postId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, reacted_by_me: !p.reacted_by_me, reaction_count: p.reaction_count + (p.reacted_by_me ? -1 : 1) }
          : p,
      ),
    )
    await fetch(`/api/posts/${postId}/react`, { method: 'POST' })
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="rounded-card border border-kuska-border bg-white p-5">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder={`¿Qué quieres contarle a Kuska hoy, ${authSession?.user.name?.split(' ')[0] ?? ''}?`}
          className="h-20 w-full resize-none rounded-btn border border-kuska-border p-3 font-body text-sm focus:border-kuska-gold focus:outline-none"
        />
        <div className="mt-2 flex justify-end">
          <RippleButton>
            <Button onClick={submitPost} disabled={posting || !newPost.trim()}>
              {posting ? 'Publicando…' : 'Publicar'}
            </Button>
          </RippleButton>
        </div>
      </div>

      {loading && <p className="text-center font-body text-sm text-kuska-text-mid">Cargando historias…</p>}

      {!loading && posts.length === 0 && (
        <div className="rounded-card border border-dashed border-kuska-border bg-white p-10 text-center">
          <span className="text-3xl">🗣️</span>
          <p className="mt-2 font-body text-sm text-kuska-text-mid">Sé el primero en contar tu historia en Red Cuéntame.</p>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} onReact={react} />
      ))}
    </div>
  )
}
