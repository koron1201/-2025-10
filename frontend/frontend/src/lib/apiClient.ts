import type {
  GenerateEmailRequest,
  GenerateEmailResponse,
  SaveHistoryRequest,
  SaveHistoryResponse,
} from '../types/api'
import { generateEmailMock, saveHistoryMock } from './mocks'

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
}

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return (await res.json()) as T
}

export async function generateEmail(
  payload: GenerateEmailRequest,
  signal?: AbortSignal,
): Promise<GenerateEmailResponse> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return generateEmailMock(payload)
  }
  const res = await fetch('/api/emails/generate', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
    signal,
  })
  return handleJson<GenerateEmailResponse>(res)
}

export async function saveHistory(
  payload: SaveHistoryRequest,
  signal?: AbortSignal,
): Promise<SaveHistoryResponse> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return saveHistoryMock(payload)
  }
  const res = await fetch('/api/emails/history', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
    signal,
  })
  return handleJson<SaveHistoryResponse>(res)
}

