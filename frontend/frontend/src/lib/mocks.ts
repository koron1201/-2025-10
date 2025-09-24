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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function generateEmailMock(
  payload: GenerateEmailRequest,
): Promise<GenerateEmailResponse> {
  await delay(400)
  const keywords = payload.keywords.join('・') || 'ご連絡'
  const subject = `【モック】${keywords} の件`
  const recipientLine = payload.recipient ? `${payload.recipient} 様\n\n` : ''
  const body = `${recipientLine}いつもお世話になっております。\n\n下記の件につきましてご連絡差し上げます。\n- ${payload.keywords.join('\n- ')}\n\nご確認のほど、よろしくお願いいたします。\n\n——\nモック生成（バックエンド不要）`
  return { subject, body }
}

export async function saveHistoryMock(
  payload: SaveHistoryRequest,
): Promise<SaveHistoryResponse> {
  await delay(200)
  const randomId = Math.random().toString(36).slice(2, 10)
  const normalized = payload.emailBody
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .slice(0, 120)
  const hashLike = Array.from(normalized).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const similarityScore = (hashLike % 100) / 100
  const isDuplicate = similarityScore > 0.72
  const duplicateOfId = isDuplicate ? `mock-prev-${(hashLike % 7) + 1}` : undefined
  return { historyId: `mock-${randomId}`, isDuplicate, similarityScore, duplicateOfId }
}

export async function sendSlackMock(
  payload: SlackIntegrationRequest,
): Promise<SlackIntegrationResponse> {
  await delay(250)
  if (!payload.message || !payload.channelId) {
    return { status: 'error', errorMessage: 'message と channelId は必須です' }
  }
  const ts = `${Date.now()}.${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  return { status: 'ok', ts }
}

export async function sendOutlookMock(
  payload: OutlookIntegrationRequest,
): Promise<OutlookIntegrationResponse> {
  await delay(300)
  if (!payload.recipient || !payload.subject || !payload.body) {
    return { status: 'error', errorMessage: 'recipient, subject, body は必須です' }
  }
  const messageId = `mock-msg-${Math.random().toString(36).slice(2, 10)}`
  return { status: 'ok', messageId }
}

export async function createCalendarEventMock(
  payload: GoogleCalendarIntegrationRequest,
): Promise<GoogleCalendarIntegrationResponse> {
  await delay(300)
  if (!payload.title || !payload.startIso || !payload.endIso) {
    return { status: 'error', errorMessage: 'title, startIso, endIso は必須です' }
  }
  const eventId = `mock-event-${Math.random().toString(36).slice(2, 10)}`
  return { status: 'ok', eventId }
}


