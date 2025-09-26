import type {
  GenerateEmailRequest,
  GenerateEmailResponse,
  SaveHistoryRequest,
  SaveHistoryResponse,
  SlackIntegrationRequest,
  SlackIntegrationResponse,
  OutlookIntegrationRequest,
  OutlookIntegrationResponse,
  GoogleCalendarIntegrationRequest,
  GoogleCalendarIntegrationResponse,
} from '../types/api'
import {
  generateEmailMock,
  saveHistoryMock,
  sendSlackMock,
  sendOutlookMock,
  createCalendarEventMock,
} from './mocks'

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

