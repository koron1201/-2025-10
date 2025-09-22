import { useMemo, useState } from 'react'
import './App.css'
import { generateEmail, saveHistory } from './lib/apiClient'
import type { GenerateEmailResponse } from './types/api'

function App() {
  const [keywordsInput, setKeywordsInput] = useState('')
  const [recipient, setRecipient] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerateEmailResponse | null>(null)

  const keywords = useMemo(
    () =>
      keywordsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    [keywordsInput],
  )

  async function onGenerate() {
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const generated = await generateEmail({
        keywords,
        recipient: recipient || undefined,
      })
      setResult(generated)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  async function onSave() {
    if (!result) return
    setError(null)
    try {
      await saveHistory({ emailBody: result.body, subject: result.subject })
      alert('履歴に保存しました')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <>
      <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1>ビジネスメールAI（MVP）</h1>
        {import.meta.env.VITE_USE_MOCK === 'true' && (
          <div style={{ color: '#0a7', fontWeight: 600 }}>
            モックモード（バックエンド不要）
          </div>
        )}
        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            受信者（任意）
            <input
              placeholder="例: tanaka@example.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            キーワード（カンマ区切り）
            <input
              placeholder="例: 見積, 今週金曜, 議事録"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onGenerate} disabled={loading || keywords.length === 0}>
              {loading ? '生成中…' : 'メールを作成'}
            </button>
            <button onClick={onSave} disabled={!result}>履歴に保存</button>
          </div>
          {error && (
            <div style={{ color: 'crimson' }}>エラー: {error}</div>
          )}
          {result && (
            <div>
              <h2>件名</h2>
              <div style={{ background: '#f5f5f5', padding: 12 }}>{result.subject}</div>
              <h2>本文</h2>
              <textarea
                readOnly
                value={result.body}
                style={{ width: '100%', minHeight: 240 }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
