const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

interface GeminiOptions {
  systemPrompt: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  maxOutputTokens?: number
}

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string }[] }
  }[]
}

/**
 * Llama a Gemini (sin streaming) y devuelve el texto completo de la respuesta.
 *
 * Antes esta función devolvía un `ReadableStream` (streaming SSE real,
 * chunk por chunk) para que los endpoints de IA hicieran
 * `return new Response(readable, {...})`. En producción (Vercel, Next.js
 * 14.2.5) ese patrón crasheaba con un 500 sin ningún log ni stack trace en
 * los 4 endpoints que lo usaban (CFO-Bot, descripciones, plan de negocio,
 * match IA) — verificado en vivo contra la base de datos real, no solo en
 * local. Ni fijar la versión de Node ni envolver el handler en try/catch
 * evitó el crash, lo que apunta a una incompatibilidad de la plataforma con
 * `Response(ReadableStream)` en este Route Handler, no a un bug de lógica.
 * Esperar la respuesta completa aquí y devolver texto plano es el patrón
 * más básico y universalmente soportado — sacrifica el efecto visual de
 * "escritura en vivo" pero es lo que realmente funciona en producción.
 */
export async function generateGemini({ systemPrompt, messages, maxOutputTokens = 800 }: GeminiOptions): Promise<string> {
  if (!GEMINI_API_KEY) {
    return '[Kuska IA no está configurada. Falta GEMINI_API_KEY.]'
  }

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  try {
    const res = await fetch(`${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          maxOutputTokens,
          temperature: 0.7,
          // gemini-2.5-flash reserva tokens de "pensamiento" interno antes de
          // responder; sin desactivarlo, maxOutputTokens se agota en el
          // razonamiento y la respuesta visible sale cortada o vacía.
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('[gemini] error HTTP:', res.status, errText)
      return '[Error de conexión con Kuska IA. Intenta de nuevo.]'
    }

    const data: GeminiResponse = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    return text || '[Kuska IA no generó una respuesta. Intenta de nuevo.]'
  } catch (e) {
    console.error('[gemini] error de conexión:', e instanceof Error ? e.message : e)
    return '[Error de conexión con Kuska IA. Intenta de nuevo.]'
  }
}
