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

const mockHistoryStore: HistoryItem[] = []

export const historyMockApi = {
  async saveHistory(payload: SaveHistoryRequest): Promise<SaveHistoryResponse> {
    await delay(120)
    const historyId = `mock-${Math.random().toString(36).slice(2, 10)}`
    const item: HistoryItem = {
      historyId,
      subject: payload.subject,
      body: payload.body,
      user: payload.user ?? 'anonymous',
      timestamp: payload.timestamp ?? new Date().toISOString(),
      isDuplicate: false,
    }
    mockHistoryStore.unshift(item)
    return item
  },

  async fetchHistory(): Promise<HistoryItem[]> {
    await delay(80)
    return [...mockHistoryStore]
  },

  async updateHistory(id: string, payload: UpdateHistoryRequest): Promise<SaveHistoryResponse> {
    await delay(100)
    const index = mockHistoryStore.findIndex((item) => item.historyId === id)
    if (index === -1) {
      throw new Error('History not found')
    }
    const current = mockHistoryStore[index]
    const updated: HistoryItem = {
      ...current,
      subject: payload.subject ?? current.subject,
      body: payload.body ?? current.body,
      user: payload.user ?? current.user,
      timestamp: payload.timestamp ?? current.timestamp,
    }
    mockHistoryStore[index] = updated
    return updated
  },

  async deleteHistory(id: string): Promise<void> {
    await delay(80)
    const index = mockHistoryStore.findIndex((item) => item.historyId === id)
    if (index !== -1) {
      mockHistoryStore.splice(index, 1)
    }
  },
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

export async function suggestWithContextMock(
  payload: SuggestWithContextRequest,
): Promise<SuggestWithContextResponse> {
  await delay(200)
  const tonePrefix = payload.settings.tone === 'formal' ? '【整形案】' : payload.settings.tone === 'friendly' ? '🙂 ' : ''
  const subjectSuggestion = payload.subject ? `${tonePrefix}${payload.subject}` : undefined
  const tips = [
    '件名は要点を先頭に',
    '結論→理由→依頼の順で簡潔に',
    `職種(${payload.settings.jobRole})の想定語彙を使用`,
  ]
  return {
    subjectSuggestion,
    bodySuggestion: `${tonePrefix}${payload.body}\n\n— コンテキスト考慮（部署: ${payload.settings.department ?? '-'}, 文化: ${payload.settings.companyStyle ?? '-'}) モック案`,
    tips,
  }
}


