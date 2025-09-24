import { useMemo, useState } from 'react'
import './App.css'
import { generateEmail, saveHistory, sendSlack, sendOutlook, createCalendarEvent } from './lib/apiClient'
import type { GenerateEmailResponse, SaveHistoryResponse } from './types/api'

function App() {
  const [keywordsInput, setKeywordsInput] = useState('')
  const [recipient, setRecipient] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerateEmailResponse | null>(null)
  const [saveResult, setSaveResult] = useState<SaveHistoryResponse | null>(null)
  const [slackMessage, setSlackMessage] = useState('')
  const [slackChannel, setSlackChannel] = useState('')
  const [slackStatus, setSlackStatus] = useState<string | null>(null)
  const [integrationTab, setIntegrationTab] = useState<'slack' | 'outlook' | 'calendar'>('slack')
  const [outlookRecipient, setOutlookRecipient] = useState('')
  const [outlookStatus, setOutlookStatus] = useState<string | null>(null)
  const [calTitle, setCalTitle] = useState('')
  const [calStart, setCalStart] = useState('')
  const [calEnd, setCalEnd] = useState('')
  const [calAttendees, setCalAttendees] = useState('')
  const [calStatus, setCalStatus] = useState<string | null>(null)

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
    setSaveResult(null)
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
      const res = await saveHistory({ emailBody: result.body, subject: result.subject })
      setSaveResult(res)
      if (res.isDuplicate) {
        // アラートも簡潔に変更
        alert('過去に似た内容のメールが保存されています。内容を確認してから送信してください。')
      } else {
        alert('履歴に保存しました')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  async function onSendSlack() {
    if (!result) return
    setError(null)
    setSlackStatus(null)
    try {
      const messageTail = slackMessage ? `\n\n${slackMessage}` : ''
      const payload = { message: `${result.subject}\n\n${result.body}${messageTail}` , channelId: slackChannel || 'general' }
      const r = await sendSlack(payload)
      setSlackStatus(r.status === 'ok' ? `送信成功 (ts: ${r.ts})` : `失敗: ${r.errorMessage}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  async function onSendOutlook() {
    if (!result) return
    setError(null)
    setOutlookStatus(null)
    try {
      const r = await sendOutlook({ recipient: outlookRecipient, subject: result.subject, body: result.body })
      setOutlookStatus(r.status === 'ok' ? `送信成功 (id: ${r.messageId})` : `失敗: ${r.errorMessage}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  async function onCreateEvent() {
    if (!result) return
    setError(null)
    setCalStatus(null)
    try {
      const title = calTitle || result.subject
      const startIso = calStart ? new Date(calStart).toISOString() : new Date().toISOString()
      const endIso = calEnd ? new Date(calEnd).toISOString() : new Date(Date.now() + 60 * 60 * 1000).toISOString()
      const attendees = calAttendees
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
      const r = await createCalendarEvent({ title, startIso, endIso, attendees, description: result.body })
      setCalStatus(r.status === 'ok' ? `作成成功 (event: ${r.eventId})` : `失敗: ${r.errorMessage}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="wa-app">
      <header className="wa-header">
        <button className="wa-header-menu" aria-label="メニュー" />
        <div className="wa-logo" aria-label="WAMail ロゴ">WAMail</div>
        <div className="wa-search">
          <span className="wa-search-icon" aria-hidden="true" />
          <input
            className="wa-search-input"
            placeholder="Search mail"
            aria-label="検索"
          />
          <button className="wa-search-filter" aria-label="フィルター" />
        </div>
        <div className="wa-header-actions">
          <button className="wa-hbtn" aria-label="ヘルプ" />
          <button className="wa-hbtn" aria-label="設定" />
          <button className="wa-hbtn" aria-label="アプリ" />
          <div className="wa-avatar" aria-label="ユーザー" />
        </div>
      </header>

      <div className="wa-main">
        <aside className="wa-nav">
          <button className="wa-compose">
            <span className="wa-compose-icon" aria-hidden="true" />
            <span>Compose</span>
          </button>

          <nav className="wa-nav-list">
            <a className="wa-nav-item active">
              <span className="wa-nav-icon inbox" aria-hidden="true" />
              <span className="label">Inbox</span>
              <span className="count">7</span>
            </a>
            <a className="wa-nav-item">
              <span className="wa-nav-icon star" aria-hidden="true" />
              <span className="label">Starred</span>
            </a>
            <a className="wa-nav-item">
              <span className="wa-nav-icon clock" aria-hidden="true" />
              <span className="label">Snoozed</span>
            </a>
            <a className="wa-nav-item">
              <span className="wa-nav-icon send" aria-hidden="true" />
              <span className="label">Sent</span>
            </a>
            <a className="wa-nav-item">
              <span className="wa-nav-icon file" aria-hidden="true" />
              <span className="label">Drafts</span>
            </a>
          </nav>

          <div className="wa-section">
            <div className="wa-subheader">Meet</div>
            <a className="wa-nav-item"><span className="wa-nav-icon video" aria-hidden="true" /><span className="label">New meeting</span></a>
            <a className="wa-nav-item"><span className="wa-nav-icon keyboard" aria-hidden="true" /><span className="label">Join a meeting</span></a>
          </div>

          <div className="wa-section">
            <div className="wa-subheader">Hangouts</div>
            <div className="wa-no-chats">
              <div>No recent chats</div>
              <div className="wa-start-chat">Start a new one</div>
            </div>
          </div>
        </aside>

        <section className="wa-content">
          <div className="wa-toolbar">
            <div className="wa-toolbar-left">
              <button className="wa-tbtn back" aria-label="戻る" />
              <div className="wa-tgroup">
                <button className="wa-tbtn package" aria-label="アーカイブ" />
                <button className="wa-tbtn alert" aria-label="報告" />
                <button className="wa-tbtn delete" aria-label="削除" />
              </div>
              <div className="wa-divider" />
              <div className="wa-tgroup">
                <button className="wa-tbtn unread" aria-label="未読にする" />
                <button className="wa-tbtn clock" aria-label="スヌーズ" />
                <button className="wa-tbtn check" aria-label="完了" />
              </div>
              <div className="wa-divider" />
              <div className="wa-tgroup">
                <button className="wa-tbtn move" aria-label="移動" />
                <button className="wa-tbtn label" aria-label="ラベル" />
                <button className="wa-tbtn more" aria-label="その他" />
              </div>
            </div>
            <div className="wa-toolbar-right">
              <span className="wa-range">7 of 785</span>
              <div className="wa-tgroup">
                <button className="wa-tbtn prev" aria-label="前へ" />
                <button className="wa-tbtn next" aria-label="次へ" />
                <button className="wa-tbtn lang" aria-label="言語" />
              </div>
            </div>
          </div>

          <div className="wa-mail">
            <div className="wa-mail-head">
              <div className="wa-mail-title">
                <div className="title">{result ? result.subject : 'Place for your email content'}</div>
                <div className="tag">Inbox</div>
              </div>
              <div className="wa-mail-actions">
                <button className="wa-tbtn print" aria-label="印刷" />
                <button className="wa-tbtn open" aria-label="新しいタブで開く" />
              </div>
            </div>

            <div className="wa-mail-meta">
              <div className="wa-sender">
                <div className="avatar" />
                <div className="meta">
                  <div className="row1">
                    <div className="name">Sender Name</div>
                    <div className="email">&lt;email@domain.com&gt;</div>
                    <button className="unsubscribe">Unsubscribe</button>
                  </div>
                  <div className="row2">
                    <div className="to">to me</div>
                  </div>
                </div>
              </div>
              <div className="wa-mail-quick">
                <button className="wa-tbtn star" aria-label="スター" />
                <button className="wa-tbtn reply" aria-label="返信" />
                <button className="wa-tbtn more" aria-label="その他" />
                <div className="date">Wed, Sep 15, 8:07 AM (2 days ago)</div>
              </div>
            </div>

            <div className="wa-mail-body">
              {import.meta.env.VITE_USE_MOCK === 'true' && (
                <div className="wa-mock">モックモード（バックエンド不要）</div>
              )}
              <div className="wa-form">
                <label className="wa-field">
                  <span className="wa-field-label">受信者（任意）</span>
                  <input
                    className="wa-input"
                    placeholder="例: tanaka@example.com"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </label>
                <label className="wa-field">
                  <span className="wa-field-label">キーワード（カンマ区切り）</span>
                  <input
                    className="wa-input"
                    placeholder="例: 見積, 今週金曜, 議事録"
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                  />
                </label>
                <div className="wa-actions">
                  <button className="wa-btn primary" onClick={onGenerate} disabled={loading || keywords.length === 0}>
                    {loading ? '生成中…' : 'メールを作成'}
                  </button>
                  <button className="wa-btn" onClick={onSave} disabled={!result}>履歴に保存</button>
                </div>
                {saveResult && (
                  <div className="wa-section-box">
                    {saveResult.isDuplicate ? (
                      <>⚠️ 過去に似た内容のメールが保存されています。内容を確認してから送信してください。</>
                    ) : (
                      <>✅ 履歴に保存しました</>
                    )}
                  </div>
                )}
                {error && <div className="wa-error">エラー: {error}</div>}
              </div>

              {result && (
                <>
                  <div className="wa-result">
                    <div className="wa-result-section">
                      <div className="wa-section-title">件名</div>
                      <div className="wa-section-box">{result.subject}</div>
                    </div>
                    <div className="wa-result-section">
                      <div className="wa-section-title">本文</div>
                      <textarea className="wa-section-textarea" readOnly value={result.body} />
                    </div>
                  </div>
                  <div className="wa-result-section">
                    <div className="wa-section-title">外部アプリに共有</div>
                    <div className="wa-tabs">
                      <button className={`wa-tab ${integrationTab === 'slack' ? 'active' : ''}`} onClick={() => setIntegrationTab('slack')}>Slack</button>
                      <button className={`wa-tab ${integrationTab === 'outlook' ? 'active' : ''}`} onClick={() => setIntegrationTab('outlook')}>Outlook</button>
                      <button className={`wa-tab ${integrationTab === 'calendar' ? 'active' : ''}`} onClick={() => setIntegrationTab('calendar')}>Google Calendar</button>
                    </div>

                    {integrationTab === 'slack' && (
                      <div className="wa-tabpanel">
                        <div className="wa-field">
                          <span className="wa-field-label">チャンネルID</span>
                          <input className="wa-input" placeholder="例: C0123456 または general" value={slackChannel} onChange={(e) => setSlackChannel(e.target.value)} />
                        </div>
                        <div className="wa-field">
                          <span className="wa-field-label">メッセージ（任意に追記）</span>
                          <input className="wa-input" placeholder="件名+本文に追記したい内容" value={slackMessage} onChange={(e) => setSlackMessage(e.target.value)} />
                        </div>
                        <div className="wa-actions">
                          <button className="wa-btn" onClick={onSendSlack}>Slackに送信</button>
                        </div>
                        {slackStatus && <div className="wa-section-box">{slackStatus}</div>}
                      </div>
                    )}

                    {integrationTab === 'outlook' && (
                      <div className="wa-tabpanel">
                        <div className="wa-field">
                          <span className="wa-field-label">宛先（メールアドレス）</span>
                          <input className="wa-input" placeholder="例: tanaka@example.com" value={outlookRecipient} onChange={(e) => setOutlookRecipient(e.target.value)} />
                        </div>
                        <div className="wa-actions">
                          <button className="wa-btn" onClick={onSendOutlook} disabled={!outlookRecipient}>Outlookで送信</button>
                        </div>
                        {outlookStatus && <div className="wa-section-box">{outlookStatus}</div>}
                      </div>
                    )}

                    {integrationTab === 'calendar' && (
                      <div className="wa-tabpanel">
                        <div className="wa-field">
                          <span className="wa-field-label">タイトル</span>
                          <input className="wa-input" placeholder="例: 打ち合わせ" value={calTitle} onChange={(e) => setCalTitle(e.target.value)} />
                        </div>
                        <div className="wa-field">
                          <span className="wa-field-label">開始日時</span>
                          <input type="datetime-local" className="wa-input" value={calStart} onChange={(e) => setCalStart(e.target.value)} />
                        </div>
                        <div className="wa-field">
                          <span className="wa-field-label">終了日時</span>
                          <input type="datetime-local" className="wa-input" value={calEnd} onChange={(e) => setCalEnd(e.target.value)} />
                        </div>
                        <div className="wa-field">
                          <span className="wa-field-label">参加者（カンマ区切り）</span>
                          <input className="wa-input" placeholder="例: sato@example.com,suzuki@example.com" value={calAttendees} onChange={(e) => setCalAttendees(e.target.value)} />
                        </div>
                        <div className="wa-actions">
                          <button className="wa-btn" onClick={onCreateEvent}>予定を作成</button>
                        </div>
                        {calStatus && <div className="wa-section-box">{calStatus}</div>}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <aside className="wa-appbar">
          <button className="wa-appbtn" aria-label="アプリ1" />
          <button className="wa-appbtn" aria-label="アプリ2" />
          <button className="wa-appbtn" aria-label="アプリ3" />
          <div className="wa-app-sep" />
          <button className="wa-appbtn add" aria-label="追加" />
        </aside>
      </div>
    </div>
  )
}

export default App
