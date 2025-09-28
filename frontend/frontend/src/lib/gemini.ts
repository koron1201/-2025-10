import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GenerateEmailRequest, GenerateEmailResponse } from '../types/api'

function parseJsonFromText(text: string): any {
	const stripped = text
		.replace(/^```json\s*/i, '')
		.replace(/^```\s*/i, '')
		.replace(/```$/i, '')
		.trim()
	try {
		return JSON.parse(stripped)
	} catch (e) {
		throw new Error('Gemini 出力のJSON解析に失敗しました')
	}
}

export async function generateEmailWithGemini(
	payload: GenerateEmailRequest,
): Promise<GenerateEmailResponse> {
	const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY as string | undefined
	if (!apiKey) throw new Error('VITE_GEMINI_API_KEY が設定されていません')

	const modelName = ((import.meta as any).env.VITE_GEMINI_MODEL as string | undefined) || 'gemini-1.5-flash'
	const genAI = new GoogleGenerativeAI(apiKey)
	const model = genAI.getGenerativeModel({ model: modelName })

	const keywords = payload.keywords.join(', ')
	const recipientLine = payload.recipient ? `受信者: ${payload.recipient}\n` : ''

	const prompt = [
		'あなたはビジネスメールの日本語ライティングアシスタントです。',
		'入力のキーワードに基づき、丁寧で簡潔な件名と本文を作成してください。',
		'出力は必ずJSONだけで、キーは "subject" と "body" にしてください。',
		'本文は敬体で、挨拶→用件→依頼/締め の構成を基本とし、改行で読みやすくしてください。',
		recipientLine,
		`キーワード: ${keywords}`,
		'',
		'出力例:',
		'```json',
		'{ "subject": "【打ち合わせの件】日程候補のご相談", "body": "いつもお世話になっております。..."}',
		'```',
	].join('\n')

	const res = await model.generateContent(prompt)
	const text = res.response.text()
	const data = parseJsonFromText(text)

	if (!data?.subject || !data?.body) {
		throw new Error('Gemini からの出力が想定形式ではありません')
	}
	return { subject: data.subject, body: data.body }
}


