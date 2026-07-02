import Anthropic from '@anthropic-ai/sdk'

const globalForAnthropic = globalThis as unknown as {
  anthropic: Anthropic | undefined
}

export const anthropic =
  globalForAnthropic.anthropic ?? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

if (process.env.NODE_ENV !== 'production') globalForAnthropic.anthropic = anthropic

/** Modelo de IA de Kuska, según CLAUDE.md. */
export const KUSKA_AI_MODEL = 'claude-sonnet-4-6'
