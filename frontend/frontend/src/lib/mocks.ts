import type {
  GenerateEmailRequest,
  GenerateEmailResponse,
  SaveHistoryRequest,
  SaveHistoryResponse,
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
  const isDuplicate = payload.emailBody.length % 2 === 0
  return { historyId: `mock-${randomId}`, isDuplicate }
}


