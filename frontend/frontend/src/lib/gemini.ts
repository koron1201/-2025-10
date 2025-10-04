import type { GenerateEmailRequest, GenerateEmailResponse } from '../types/api'

function tryParseJson(possiblyCodeFenced: string): any {
  const trimmed = possiblyCodeFenced.trim()
  const withoutFence = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  try {
    return JSON.parse(withoutFence)
  } catch {
    return null
  }
}

function normalizeModelName(modelFromEnv?: string): string {
  const trimmed = (modelFromEnv ?? '').trim()
  if (!trimmed) return 'gemini-1.5-flash-001'
  if (/^gemini-1\.5-flash$/i.test(trimmed)) return 'gemini-1.5-flash-001'
  return trimmed
}

type ApiVersion = 'v1' | 'v1beta'
type ListedModel = { name: string; supported: string[] }
type Resolved = { version: ApiVersion; model: string }

type GeminiApiError = Error & { status?: number; responseText?: string }

const RETRIABLE_STATUS = new Set([429, 503])

function isRetriableStatus(status?: number): boolean {
  return typeof status === 'number' && RETRIABLE_STATUS.has(status)
}

function isStableModelName(name: string): boolean {
  return /^gemini-(?:1(?:\.\d+)?|1\.5|1\.0|pro)/i.test(name)
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

const BASE_PREFERRED_MODELS = [
  'gemini-1.5-flash-001',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-001',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.0-pro',
  'gemini-1.0-pro-001',
]

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function listModels(apiKey: string, version: ApiVersion): Promise<ListedModel[]> {
  const url = `https://generativelanguage.googleapis.com/${version}/models?key=${encodeURIComponent(apiKey)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ListModels ${version} error ${res.status}`)
  const json = await res.json()
  const models: ListedModel[] = (json.models ?? []).map((m: any) => ({
    name: String(m.name || '').replace(/^models\//, ''),
    supported: Array.isArray(m.supportedGenerationMethods) ? m.supportedGenerationMethods : [],
  }))
  return models
}

async function resolveModel(apiKey: string, desired: string): Promise<Resolved> {
  const candidates = await resolveModelCandidates(apiKey, desired)
  if (candidates.length === 0) {
    throw new Error('利用可能なGeminiモデルが見つからないか、generateContent が非対応です。')
  }
  return candidates[0]
}

async function generateViaRest(apiKey: string, version: ApiVersion, model: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`
  const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }] }
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const errText = await r.text().catch(() => '')
    const error: GeminiApiError = new Error(`Gemini ${version}/${model} error ${r.status}: ${errText}`)
    error.status = r.status
    error.responseText = errText
    throw error
  }
  const data = await r.json()
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join('') ??
    data?.candidates?.[0]?.output ??
    ''
  return String(text || '')
}

async function resolveModelCandidates(apiKey: string, desired: string): Promise<Resolved[]> {
  const preferred = unique([desired, ...BASE_PREFERRED_MODELS])
  const results: Resolved[] = []
  const seen = new Set<string>()

  for (const version of ['v1', 'v1beta'] as const) {
    let models: ListedModel[] = []
    try {
      models = await listModels(apiKey, version)
    } catch {
      continue
    }

    const byName = new Map(models.map((m) => [m.name, m]))
    for (const name of preferred) {
      const model = byName.get(name)
      if (!model) continue
      if (!model.supported.includes('generateContent')) continue
      const key = `${version}:${model.name}`
      if (seen.has(key)) continue
      results.push({ version, model: model.name })
      seen.add(key)
    }

    for (const model of models) {
      if (!model.supported.includes('generateContent')) continue
      if (!isStableModelName(model.name)) continue
      const key = `${version}:${model.name}`
      if (seen.has(key)) continue
      results.push({ version, model: model.name })
      seen.add(key)
    }

    for (const model of models) {
      if (!model.supported.includes('generateContent')) continue
      const key = `${version}:${model.name}`
      if (seen.has(key)) continue
      results.push({ version, model: model.name })
      seen.add(key)
    }
  }

  return results
}

export async function generateEmailWithGemini(
  payload: GenerateEmailRequest,
): Promise<GenerateEmailResponse> {
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY as string | undefined
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set')

  const rawModel = (import.meta as any).env.VITE_GEMINI_MODEL as string | undefined
  const desiredModel = normalizeModelName(rawModel)

  const keywords = payload.keywords.join(', ')
  const recipientLine = payload.recipient ? `受信者: ${payload.recipient}\n` : ''

  const prompt = [
    'あなたはビジネスメールの日本語ライティングアシスタントです。',
    '入力のキーワードに基づき、丁寧で簡潔な件名(subject)と本文(body)を作成してください。',
    '出力は必ずJSONのみで返してください（余計な説明やコードフェンスは不要）。',
    '本文は敬体で、挨拶→用件→依頼/締め の構成を基本とし、改行で読みやすくしてください。',
    recipientLine,
    `キーワード: ${keywords}`,
    '',
    '出力例（参考。実際の出力もJSONのみ）:',
    '{ "subject": "【打ち合わせの件】日程候補のご相談", "body": "いつもお世話になっております。…" }',
  ].join('\n')

  const candidates = await resolveModelCandidates(apiKey, desiredModel)
  if (candidates.length === 0) {
    throw new Error('利用可能なGeminiモデルが見つかりません（generateContent 対応モデルなし）')
  }

  const MAX_ATTEMPTS_PER_MODEL = 3
  const BASE_DELAY_MS = 300
  const errors: string[] = []

  for (const { version, model } of candidates) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_MODEL; attempt++) {
      const isLastAttempt = attempt === MAX_ATTEMPTS_PER_MODEL - 1
      try {
        const text = await generateViaRest(apiKey, version, model, prompt)
        const parsed = parseGeminiResponse(text)
        if (!parsed) {
          throw new Error('Geminiの出力が想定形式(JSON: subject, body)ではありません')
        }
        return parsed
      } catch (err) {
        const e = err as GeminiApiError | Error
        const status = (e as GeminiApiError).status
        const message = e instanceof Error ? e.message : String(e)
        if (!isLastAttempt && isRetriableStatus(status)) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt)
          await sleep(delay)
          continue
        }
        errors.push(`${version}/${model}: ${message}`)
        break
      }
    }
  }

  throw new Error(`Gemini呼び出しに失敗しました。試行内容: ${errors.join(' | ')}`)
}

function parseGeminiResponse(text: string): GenerateEmailResponse | null {
  let data = tryParseJson(text)
  if (!data) {
    const subjMatch = text.match(/"subject"\s*:\s*"([\s\S]*?)"/)
    const bodyMatch = text.match(/"body"\s*:\s*"([\s\S]*?)"/)
    if (subjMatch && bodyMatch) {
      data = { subject: JSON.parse(`"${subjMatch[1]}"`), body: JSON.parse(`"${bodyMatch[1]}"`) }
    }
  }

  if (!data?.subject || !data?.body) {
    return null
  }

  return { subject: String(data.subject), body: String(data.body) }
}