import { useMemo, useState, useEffect, useRef } from 'react'
import './App.css'
import { generateEmail, saveHistory, sendSlack, sendOutlook, createCalendarEvent } from './lib/apiClient'
import type { GenerateEmailResponse, SaveHistoryResponse } from './types/api'
import { useLanguage } from './contexts/LanguageContext'
import { type Language, languageNames } from './lib/i18n'

function App() {
  const { language, setLanguage, t } = useLanguage()
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
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const languageDropdownRef = useRef<HTMLDivElement>(null)

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false)
      }
    }

    if (showLanguageDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showLanguageDropdown])

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
        <div className="wa-logo" aria-label={`${t.appName} ロゴ`}>{t.appName}</div>
        <div className="wa-search">
          <span className="wa-search-icon" aria-hidden="true" />
          <input
            className="wa-search-input"
            placeholder={t.searchPlaceholder}
            aria-label="検索"
          />
          <button className="wa-search-filter" aria-label="フィルター" />
        </div>
        <div className="wa-header-actions">
          <button className="wa-hbtn" aria-label="ヘルプ" />
          <button className="wa-hbtn" aria-label="設定" />
          <div className="wa-language-selector" ref={languageDropdownRef}>
            <button 
              className="wa-hbtn wa-language-btn" 
              aria-label={t.language}
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              🌐
            </button>
            {showLanguageDropdown && (
              <div className="wa-language-dropdown">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    className={`wa-language-option ${language === lang ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(lang)
                      setShowLanguageDropdown(false)
                    }}
                  >
                    {languageNames[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="wa-hbtn" aria-label="アプリ" />
          <div className="wa-avatar" aria-label="ユーザー" />
        </div>
      </header>

      <div className="wa-main">
        <aside className="wa-nav">
          <button className="wa-compose">
            <span className="wa-compose-icon" aria-hidden="true" />
            <span>{t.compose}</span>
          </button>

          <nav className="wa-nav-list">
            <a className="wa-nav-item active">
              <span className="wa-nav-icon inbox" aria-hidden="true" />
              <span className="label">{t.inbox}</span>
              <span className="count">7</span>
            </a>
            <a className="wa-nav-item">
              <span className="wa-nav-icon star" aria-hidden="true" />
              <span className="label">{t.starred}</span>
            </a>
            <a className="wa-nav-item">
              <span className="wa-nav-icon clock" aria-hidden="true" />
              <span className="label">{t.snoozed}</span>
            </a>
            <a className="wa-nav-item">
              <span className="wa-nav-icon send" aria-hidden="true" />
              <span className="label">{t.sent}</span>
            </a>
            <a className="wa-nav-item">
              <span className="wa-nav-icon file" aria-hidden="true" />
              <span className="label">{t.drafts}</span>
            </a>
          </nav>

          <div className="wa-section">
            <div className="wa-subheader">{t.meet}</div>
            <a className="wa-nav-item"><span className="wa-nav-icon video" aria-hidden="true" /><span className="label">{t.newMeeting}</span></a>
            <a className="wa-nav-item"><span className="wa-nav-icon keyboard" aria-hidden="true" /><span className="label">{t.joinMeeting}</span></a>
          </div>

          <div className="wa-section">
            <div className="wa-subheader">{t.hangouts}</div>
            <div className="wa-no-chats">
              <div>{t.noRecentChats}</div>
              <div className="wa-start-chat">{t.startNewChat}</div>
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
              <span className="wa-range">7 {t.pageInfo} 785</span>
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
                <div className="tag">{t.inbox}</div>
              </div>
              <div className="wa-mail-actions">
                <button className="wa-tbtn print" aria-label="印刷" />
                <button className="wa-tbtn open" aria-label="新しいタブで開く" />
              </div>
            </div>

            <div className="wa-mail-meta">
              <div className="wa-sender">
                <div className="avatar">S</div>
                <div className="meta">
                  <div className="row1">
                    <div className="name">{t.senderName}</div>
                    <div className="email">&lt;email@domain.com&gt;</div>
                    <button className="unsubscribe">{t.unsubscribe}</button>
                  </div>
                  <div className="row2">
                    <div className="to">{t.toMe}</div>
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
                <div className="wa-mock">{t.mockMode}</div>
              )}
              <div className="wa-form">
                <label className="wa-field">
                  <span className="wa-field-label">{t.recipientOptional}</span>
                  <input
                    className="wa-input"
                    placeholder={t.recipientPlaceholder}
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </label>
                <label className="wa-field">
                  <span className="wa-field-label">{t.keywordsLabel}</span>
                  <input
                    className="wa-input"
                    placeholder={t.keywordsPlaceholder}
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                  />
                </label>
                <div className="wa-actions">
                  <button className="wa-btn primary" onClick={onGenerate} disabled={loading || keywords.length === 0}>
                    {loading ? t.generating : t.generateEmail}
                  </button>
                  <button className="wa-btn" onClick={onSave} disabled={!result}>{t.saveToHistory}</button>
                </div>
                {saveResult && (
                  <div className="wa-section-box">
                    {saveResult.isDuplicate ? (
                      <>⚠️ {t.duplicateWarning}</>
                    ) : (
                      <>✅ {t.savedToHistory}</>
                    )}
                  </div>
                )}
                {error && <div className="wa-error">{t.errorLabel}: {error}</div>}
              </div>

              {result && (
                <>
                  <div className="wa-result">
                    <div className="wa-result-section">
                      <div className="wa-section-title">{t.subject}</div>
                      <div className="wa-section-box">{result.subject}</div>
                    </div>
                    <div className="wa-result-section">
                      <div className="wa-section-title">{t.body}</div>
                      <textarea className="wa-section-textarea" readOnly value={result.body} />
                    </div>
                  </div>
                  <div className="wa-result-section">
                    <div className="wa-section-title">{t.shareWithExternalApps}</div>
                    <div className="wa-tabs">
                      <button className={`wa-tab ${integrationTab === 'slack' ? 'active' : ''}`} onClick={() => setIntegrationTab('slack')}>{t.slack}</button>
                      <button className={`wa-tab ${integrationTab === 'outlook' ? 'active' : ''}`} onClick={() => setIntegrationTab('outlook')}>{t.outlook}</button>
                      <button className={`wa-tab ${integrationTab === 'calendar' ? 'active' : ''}`} onClick={() => setIntegrationTab('calendar')}>{t.googleCalendar}</button>
                    </div>

                    {integrationTab === 'slack' && (
                      <div className="wa-tabpanel">
                        <div className="wa-field">
                          <span className="wa-field-label">{t.channelId}</span>
                          <input className="wa-input" placeholder={t.channelIdPlaceholder} value={slackChannel} onChange={(e) => setSlackChannel(e.target.value)} />
                        </div>
                        <div className="wa-field">
                          <span className="wa-field-label">{t.additionalMessage}</span>
                          <input className="wa-input" placeholder={t.additionalMessagePlaceholder} value={slackMessage} onChange={(e) => setSlackMessage(e.target.value)} />
                        </div>
                        <div className="wa-actions">
                          <button className="wa-btn" onClick={onSendSlack}>{t.sendToSlack}</button>
                        </div>
                        {slackStatus && <div className="wa-section-box">{slackStatus}</div>}
                      </div>
                    )}

                    {integrationTab === 'outlook' && (
                      <div className="wa-tabpanel">
                        <div className="wa-field">
                          <span className="wa-field-label">{t.emailRecipient}</span>
                          <input className="wa-input" placeholder={t.emailRecipientPlaceholder} value={outlookRecipient} onChange={(e) => setOutlookRecipient(e.target.value)} />
                        </div>
                        <div className="wa-actions">
                          <button className="wa-btn" onClick={onSendOutlook} disabled={!outlookRecipient}>{t.sendWithOutlook}</button>
                        </div>
                        {outlookStatus && <div className="wa-section-box">{outlookStatus}</div>}
                      </div>
                    )}

                    {integrationTab === 'calendar' && (
                      <div className="wa-tabpanel">
                        <div className="wa-field">
                          <span className="wa-field-label">{t.eventTitle}</span>
                          <input className="wa-input" placeholder={t.eventTitlePlaceholder} value={calTitle} onChange={(e) => setCalTitle(e.target.value)} />
                        </div>
                        <div className="wa-field">
                          <span className="wa-field-label">{t.startDateTime}</span>
                          <input type="datetime-local" className="wa-input" value={calStart} onChange={(e) => setCalStart(e.target.value)} />
                        </div>
                        <div className="wa-field">
                          <span className="wa-field-label">{t.endDateTime}</span>
                          <input type="datetime-local" className="wa-input" value={calEnd} onChange={(e) => setCalEnd(e.target.value)} />
                        </div>
                        <div className="wa-field">
                          <span className="wa-field-label">{t.attendees}</span>
                          <input className="wa-input" placeholder={t.attendeesPlaceholder} value={calAttendees} onChange={(e) => setCalAttendees(e.target.value)} />
                        </div>
                        <div className="wa-actions">
                          <button className="wa-btn" onClick={onCreateEvent}>{t.createEvent}</button>
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
