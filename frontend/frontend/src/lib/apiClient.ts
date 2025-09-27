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
  GetContextTemplatesRequest,
  GetContextTemplatesResponse,
  SuggestWithContextRequest,
  SuggestWithContextResponse,
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

export async function getContextTemplates(
  payload: GetContextTemplatesRequest,
  signal?: AbortSignal,
): Promise<GetContextTemplatesResponse> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    // モックは mocks.ts 側の関数に委譲せず、簡易レスポンスをここで返す（依存最小化）
    const samples: Record<string, GetContextTemplatesResponse> = {
      sales: {
        templates: [
          { id: 'sales-1', name: '見積依頼', subject: '【見積依頼】{商品名} の件', body: 'いつもお世話になっております。\n{会社名} の {あなたの名前} です。\n{商品名} につきまして下記条件でお見積りをお願いできますでしょうか。\n…' },
          { id: 'sales-2', name: '提案フォロー', subject: '先日のご提案のフォロー', body: '先日はご提案の機会をいただきありがとうございました。\nご検討状況はいかがでしょうか。…' },
        ],
      },
      support: {
        templates: [
          { id: 'support-1', name: '一次回答', subject: '【ご連絡】お問い合わせの件', body: 'お問い合わせありがとうございます。\n以下のとおり一次回答をお送りします。…' },
          { id: 'support-2', name: '解決報告', subject: '【解決報告】事象の改善について', body: 'ご連絡いただいた事象について、以下の対応により解決いたしました。…' },
        ],
      },
      hr: {
        templates: [
          { id: 'hr-1', name: '面接日程', subject: '面接日程のご案内', body: 'このたびは当社にご応募いただきありがとうございます。\n面接日程についてご案内申し上げます。…' },
          { id: 'hr-2', name: '内定通知', subject: '【重要】内定のご連絡', body: '選考の結果、内定とさせていただきました。\nつきましては下記のとおりご案内いたします。…' },
        ],
      },
      dev: {
        templates: [
          { id: 'dev-1', name: 'リリース案内', subject: '【リリース通知】{プロダクト名} v{バージョン}', body: '関係各位\n{プロダクト名} v{バージョン} をリリースしました。変更点は以下の通りです。…' },
          { id: 'dev-2', name: 'インシデント報告', subject: '【障害報告】{サービス名}', body: '関係各位\n{サービス名} にて以下の障害が発生しました。現在の状況は…' },
        ],
      },
    }
    return samples[payload.jobRole] || { templates: [] }
  }
  const res = await fetch('/api/context/templates', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
    signal,
  })
  return handleJson<GetContextTemplatesResponse>(res)
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

