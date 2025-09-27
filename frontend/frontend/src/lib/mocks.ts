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

export async function getContextTemplatesMock(
  payload: GetContextTemplatesRequest,
): Promise<GetContextTemplatesResponse> {
  await delay(150)
  const role = payload.jobRole
  if (role === 'sales') {
    return {
      templates: [
        { id: 'sales-1', name: '見積依頼', subject: '【見積依頼】{商品名} の件', body: '見積依頼の本文テンプレート…' },
        { id: 'sales-2', name: 'ご提案フォロー', subject: '先日のご提案の件', body: 'ご提案フォローの本文テンプレート…' },
      ],
    }
  }
  if (role === 'support') {
    return {
      templates: [
        { id: 'support-1', name: '一次回答', subject: '【ご連絡】お問い合わせの件', body: '一次回答の本文テンプレート…' },
        { id: 'support-2', name: '解決報告', subject: '【解決報告】事象の改善について', body: '解決報告の本文テンプレート…' },
      ],
    }
  }
  if (role === 'hr') {
    return {
      templates: [
        { id: 'hr-1', name: '面接案内', subject: '面接日程のご案内', body: '面接案内の本文テンプレート…' },
        { id: 'hr-2', name: '内定通知', subject: '【重要】内定のご連絡', body: '内定通知の本文テンプレート…' },
      ],
    }
  }
  // dev
  return {
    templates: [
      { id: 'dev-1', name: 'リリース案内', subject: '【リリース通知】{プロダクト名} v{バージョン}', body: 'リリース案内の本文テンプレート…' },
      { id: 'dev-2', name: '障害報告', subject: '【障害報告】{サービス名}', body: '障害報告の本文テンプレート…' },
    ],
  }
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


