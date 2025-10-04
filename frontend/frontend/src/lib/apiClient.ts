import type {
  GenerateEmailRequest,
  GenerateEmailResponse,
  SaveHistoryRequest,
  SaveHistoryResponse,
  UpdateHistoryRequest,
  HistoryItem,
  SlackIntegrationRequest,
  SlackIntegrationResponse,
  OutlookIntegrationRequest,
  OutlookIntegrationResponse,
  GoogleCalendarIntegrationRequest,
  GoogleCalendarIntegrationResponse,
  SuggestWithContextRequest,
  SuggestWithContextResponse,
} from '../types/api'
import {
  generateEmailMock,
  historyMockApi,
  sendSlackMock,
  sendOutlookMock,
  createCalendarEventMock,
} from './mocks'
import { generateEmailWithGemini } from './gemini'

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

function mapHistoryItem(raw: any): HistoryItem {
  return {
    historyId: String(raw?.historyId ?? raw?.id ?? ''),
    subject: raw?.subject ?? '',
    body: raw?.body ?? '',
    user: raw?.user ?? 'anonymous',
    timestamp: raw?.timestamp ?? undefined,
    isDuplicate: raw?.isDuplicate ?? raw?.duplicate ?? false,
    similarityScore:
      typeof raw?.similarityScore === 'number' ? raw.similarityScore : undefined,
    duplicateOfId: raw?.duplicateOfId ?? undefined,
  }
}

export async function generateEmail(
  payload: GenerateEmailRequest,
  signal?: AbortSignal,
): Promise<GenerateEmailResponse> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return generateEmailMock(payload)
  }
  if ((import.meta as any).env.VITE_USE_GEMINI === 'true') {
    return generateEmailWithGemini(payload)
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
    return historyMockApi.saveHistory(payload)
  }
  const res = await fetch('/api/history/add', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      subject: payload.subject,
      body: payload.body,
      user: payload.user ?? 'anonymous',
      timestamp: payload.timestamp ?? new Date().toISOString(),
    }),
    signal,
  })
  const data = await handleJson<any>(res)
  return mapHistoryItem(data)
}

export async function fetchHistory(signal?: AbortSignal): Promise<HistoryItem[]> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return historyMockApi.fetchHistory()
  }
  const res = await fetch('/api/history/all', {
    headers: defaultHeaders,
    signal,
  })
  const list = await handleJson<any[]>(res)
  return list.map(mapHistoryItem)
}

export async function updateHistory(
  id: string,
  payload: UpdateHistoryRequest,
  signal?: AbortSignal,
): Promise<SaveHistoryResponse> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return historyMockApi.updateHistory(id, payload)
  }
  const res = await fetch(`/api/history/${id}`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
    signal,
  })
  const data = await handleJson<any>(res)
  return mapHistoryItem(data)
}

export async function deleteHistory(
  id: string,
  signal?: AbortSignal,
): Promise<void> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await historyMockApi.deleteHistory(id)
    return
  }
  const res = await fetch(`/api/history/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders,
    signal,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to delete history: ${res.status} ${text}`)
  }
}

export async function sendSlack(
  payload: SlackIntegrationRequest,
  signal?: AbortSignal,
): Promise<SlackIntegrationResponse> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return sendSlackMock(payload)
  }
  const res = await fetch('/api/integrations/slack', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
    signal,
  })
  return handleJson<SlackIntegrationResponse>(res)
}

export async function sendOutlook(
  payload: OutlookIntegrationRequest,
  signal?: AbortSignal,
): Promise<OutlookIntegrationResponse> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return sendOutlookMock(payload)
  }
  const res = await fetch('/api/integrations/outlook', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
    signal,
  })
  return handleJson<OutlookIntegrationResponse>(res)
}

export async function createCalendarEvent(
  payload: GoogleCalendarIntegrationRequest,
  signal?: AbortSignal,
): Promise<GoogleCalendarIntegrationResponse> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return createCalendarEventMock(payload)
  }
  const res = await fetch('/api/integrations/google-calendar', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
    signal,
  })
  return handleJson<GoogleCalendarIntegrationResponse>(res)
}

export async function suggestWithContext(
  payload: SuggestWithContextRequest,
  signal?: AbortSignal,
): Promise<SuggestWithContextResponse> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const prefix = payload.settings.tone === 'friendly' ? '🙂 ' : payload.settings.tone === 'formal' ? '【整形案】' : ''
    return {
      subjectSuggestion: payload.subject ? `${prefix}${payload.subject}` : undefined,
      bodySuggestion: `${prefix}${payload.body}\n\n— コンテキスト（職種: ${payload.settings.jobRole}, 部署: ${payload.settings.department ?? '-'}, 文化: ${payload.settings.companyStyle ?? '-'}) を考慮した修正案（モック）`,
      tips: ['敬語表現を統一', '段落ごとに要点を明確化', '件名は用件を先頭に配置'],
    }
  }
  const res = await fetch('/api/context/suggest', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
    signal,
  })
  return handleJson<SuggestWithContextResponse>(res)
}

