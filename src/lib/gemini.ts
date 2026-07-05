const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

interface GeminiStreamOptions {
  systemPrompt: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  maxOutputTokens?: number
}

interface GeminiStreamChunk {
  candidates?: {
    content?: { parts?: { text?: string }[] }
  }[]
}

/**
 * Llama a Gemini con streaming SSE y devuelve un ReadableStream de texto plano,
 * compatible con el mismo patrón de respuesta que usaban los endpoints con
 * Anthropic (texto plano, chunk por chunk).
 */
export function streamGemini({ systemPrompt, messages, maxOutputTokens = 800 }: GeminiStreamOptions): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        if (!GEMINI_API_KEY) {
          controller.enqueue(encoder.encode('[Kuska IA no está configurada. Falta GEMINI_API_KEY.]'))
          controller.close()
          return
        }

        const contents = messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))

        const res = await fetch(
          `${GEMINI_BASE_URL}/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: {
                maxOutputTokens,
                temperature: 0.7,
                // gemini-2.5-flash reserva tokens de "pensamiento" interno antes
                // de responder; sin desactivarlo, maxOutputTokens se agota en el
                // razonamiento y la respuesta visible sale cortada o vacía.
                thinkingConfig: { thinkingBudget: 0 },
              },
            }),
          },
        )

        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => '')
          console.error('[gemini] error HTTP:', res.status, errText)
          controller.enqueue(encoder.encode('\n\n[Error de conexión con Kuska IA. Intenta de nuevo.]'))
          controller.close()
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const jsonStr = trimmed.slice(5).trim()
            if (!jsonStr || jsonStr === '[DONE]') continue
            try {
              const parsed: GeminiStreamChunk = JSON.parse(jsonStr)
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text
              if (text) controller.enqueue(encoder.encode(text))
            } catch {
              // fragmento incompleto de SSE — se completa en la siguiente iteración
            }
          }
        }
      } catch (e) {
        console.error('[gemini] error de streaming:', e instanceof Error ? e.message : e)
        controller.enqueue(encoder.encode('\n\n[Error de conexión con Kuska IA. Intenta de nuevo.]'))
      } finally {
        controller.close()
      }
    },
  })
}
