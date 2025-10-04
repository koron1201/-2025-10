import { useMemo, useState, useEffect, useRef } from 'react'
import './App.css'
import { generateEmail, saveHistory, fetchHistory, updateHistory, deleteHistory, sendSlack, sendOutlook, createCalendarEvent, suggestWithContext } from './lib/apiClient'
import type { GenerateEmailResponse, HistoryItem, JobRole, Tone } from './types/api'
import { useLanguage } from './contexts/LanguageContext'
import { type Language, languageNames } from './lib/i18n'
import aimailorLogo from './assets/aimailor-logo.svg'

function App() {
  const { language, setLanguage, t } = useLanguage()
  type MailFolder = 'inbox' | 'sent' | 'drafts' | 'trash'
  type Mailbox = 'inbox' | 'starred' | 'snoozed' | 'sent' | 'drafts' | 'trash'
  type MailItem = {
    id: string
    subject: string
    body: string
    folder: MailFolder
    trashedFrom?: Exclude<MailFolder, 'trash'>
    starred?: boolean
    snoozedUntilTs?: number
    dateTs: number
  }
  const [keywordsInput, setKeywordsInput] = useState('')
  const [recipient, setRecipient] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerateEmailResponse | null>(null)
  const [saveResult, setSaveResult] = useState<HistoryItem | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null)
  const [historyDraft, setHistoryDraft] = useState<{ subject: string; body: string }>({ subject: '', body: '' })
  const historyDrawerRef = useRef<HTMLDivElement>(null)
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
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Context AI states
  const [jobRole, setJobRole] = useState<JobRole>('sales')
  const [tone, setTone] = useState<Tone>('neutral')
  const [department, setDepartment] = useState('')
  const [companyStyle, setCompanyStyle] = useState<'conservative' | 'casual' | ''>('')
  const [suggestedSubject, setSuggestedSubject] = useState<string | undefined>(undefined)
  const [suggestedBody, setSuggestedBody] = useState<string | undefined>(undefined)
  const [suggestTips, setSuggestTips] = useState<string[] | undefined>(undefined)

  // Meet modal states
  const [showMeetNew, setShowMeetNew] = useState(false)
  const [showMeetJoin, setShowMeetJoin] = useState(false)
  const [meetCode, setMeetCode] = useState('')

  // Chat states
  // optional info toast placeholder (not used now)

  // Mailbox states
  const [view, setView] = useState<'compose' | 'mailbox'>('compose')
  const [mailbox, setMailbox] = useState<Mailbox>('inbox')
  const [activeMailId, setActiveMailId] = useState<string | null>(null)
  const [mails, setMails] = useState<MailItem[]>(() => {
    try {
      const saved = localStorage.getItem('aimailor-mails')
      if (saved) {
        const parsed = JSON.parse(saved) as MailItem[]
        if (Array.isArray(parsed)) {
          return parsed
        }
      }
    } catch (storageError) {
      console.warn('Failed to load saved mails', storageError)
    }
    const now = Date.now()
    const seed: MailItem[] = [
      { id: 'm1', subject: '打ち合わせのご相談', body: '来週の打ち合わせについて…', folder: 'inbox', starred: true, dateTs: now - 2 * 60 * 60 * 1000 },
      { id: 'm2', subject: '請求書送付の件', body: '請求書をお送りします…', folder: 'inbox', dateTs: now - 26 * 60 * 60 * 1000 },
      { id: 'm3', subject: '納期確認', body: '納期は今週金曜を予定…', folder: 'inbox', dateTs: now - 3 * 24 * 60 * 60 * 1000 },
      { id: 'm4', subject: '議事録共有', body: '先日の会議の議事録です…', folder: 'sent', dateTs: now - 5 * 24 * 60 * 60 * 1000 },
      { id: 'm5', subject: 'ドラフト: 提案書たたき台', body: '提案書のドラフト…', folder: 'drafts', dateTs: now - 1 * 24 * 60 * 60 * 1000 },
    ]
    return seed
  })
  useEffect(() => { localStorage.setItem('aimailor-mails', JSON.stringify(mails)) }, [mails])
  const activeMail = useMemo(() => mails.find(m => m.id === activeMailId) ?? null, [mails, activeMailId])
  const openSnoozed = useMemo(() => mails.filter(m => m.folder !== 'trash' && m.snoozedUntilTs && m.snoozedUntilTs > Date.now()), [mails])
  const filteredMails = useMemo(() => {
    if (mailbox === 'inbox') return mails.filter(m => m.folder === 'inbox' && !(m.snoozedUntilTs && m.snoozedUntilTs > Date.now()))
    if (mailbox === 'starred') return mails.filter(m => m.starred && m.folder !== 'trash')
    if (mailbox === 'snoozed') return openSnoozed
    if (mailbox === 'sent') return mails.filter(m => m.folder === 'sent')
    if (mailbox === 'drafts') return mails.filter(m => m.folder === 'drafts')
    return mails.filter(m => m.folder === 'trash')
  }, [mails, mailbox, openSnoozed])
  const searchedMails = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return [] as MailItem[]
    return mails.filter(m => m.folder !== 'trash' && `${m.subject} ${m.body}`.toLowerCase().includes(q))
  }, [mails, searchQuery])
  const listToShow = searchQuery.trim() ? searchedMails : filteredMails
  const inboxCount = useMemo(() => mails.filter(m => m.folder === 'inbox' && !(m.snoozedUntilTs && m.snoozedUntilTs > Date.now())).length, [mails])
  const toggleStar = (id: string) => setMails(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
  const snoozeTomorrow = (id: string) => setMails(prev => prev.map(m => m.id === id ? { ...m, snoozedUntilTs: Date.now() + 24 * 60 * 60 * 1000 } : m))
  const unsnooze = (id: string) => setMails(prev => prev.map(m => m.id === id ? { ...m, snoozedUntilTs: undefined } : m))
  const moveToTrash = (id: string) => setMails(prev => prev.map(m => m.id === id ? m.folder === 'trash' ? m : { ...m, trashedFrom: m.folder === 'trash' ? m.trashedFrom : m.folder, folder: 'trash' } : m))
  const restoreFromTrash = (id: string) => setMails(prev => prev.map(m => {
    if (m.id !== id) return m
    if (m.folder !== 'trash') return m
    const target = m.trashedFrom ?? 'inbox'
    return { ...m, folder: target, trashedFrom: undefined }
  }))
  const permanentlyDelete = (id: string) => setMails(prev => prev.filter(m => m.id !== id))
  const handleOpenMail = (mail: MailItem) => {
    setView('compose')
    setResult({ subject: mail.subject, body: mail.body })
    setActiveMailId(mail.id)
  }

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('aimailor-search-history')
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch {
        console.warn('Failed to parse search history from localStorage')
      }
    }
  }, [])

  // Save search to history
  const saveSearchToHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query.trim())) {
      const newHistory = [query.trim(), ...searchHistory].slice(0, 10) // Keep only last 10 searches
      setSearchHistory(newHistory)
      localStorage.setItem('aimailor-search-history', JSON.stringify(newHistory))
    }
  }

  // Generate search suggestions
  const generateSuggestions = (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions(searchHistory.slice(0, 5))
      return
    }

    const lowerQuery = query.toLowerCase()
    const suggestions: string[] = []
    
    // Add matching search history
    searchHistory
      .filter(h => h.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(h => suggestions.push(h))

    // Add matching email subjects/bodies
    const uniqueTerms = new Set<string>()
    mails.forEach(mail => {
      const words = `${mail.subject} ${mail.body}`.toLowerCase().split(/\s+/)
      words.forEach(word => {
        if (word.length > 2 && word.includes(lowerQuery) && !uniqueTerms.has(word)) {
          uniqueTerms.add(word)
          if (suggestions.length < 8) {
            suggestions.push(word)
          }
        }
      })
    })

    setSearchSuggestions([...new Set(suggestions)].slice(0, 5))
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    generateSuggestions(value)
    setShowSuggestions(true)
    if (value.trim()) {
      setView('mailbox')
    }
  }

  // Handle search suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    saveSearchToHistory(suggestion)
    setView('mailbox')
  }

  // Handle search submit
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveSearchToHistory(searchQuery)
      setShowSuggestions(false)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false)
      }
      if (searchInputRef.current && !searchInputRef.current.closest('.wa-search')?.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    if (showLanguageDropdown || showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showLanguageDropdown, showSuggestions])

  // Highlight search terms in text
  const highlightSearchTerms = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0)
    let highlightedText = text
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark class="wa-search-highlight">$1</mark>')
    })
    
    return highlightedText
  }

  const keywords = useMemo(
    () =>
      keywordsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    [keywordsInput],
  )

  function extractMeetCodeOrUrl(input: string): string | null {
    if (!input) return null
    // full url
    if (/^https?:\/\//i.test(input)) return input
    // code like abc-defg-hij or 12-3456-7890 (not used by meet but tolerate)
    const code = input.replace(/\s+/g, '')
    if (/^[a-z]{3}-[a-z]{4}-[a-z]{3}$/i.test(code)) return code
    return null
  }

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
      const res = await saveHistory({ subject: result.subject, body: result.body })
      setSaveResult(res)
      if (showHistory) {
        setHistory((prev) => [res, ...prev])
      }
      if (res.isDuplicate) {
        alert('過去に似た内容のメールが保存されています。内容を確認してから送信してください。')
      } else {
        alert('履歴に保存しました')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  async function onSuggestWithContext() {
    if (!result) return
    setError(null)
    try {
      const res = await suggestWithContext({
        settings: {
          jobRole,
          tone,
          department: department || undefined,
          companyStyle: companyStyle || undefined,
        },
        subject: result.subject,
        body: result.body,
      })
      setSuggestedSubject(res.subjectSuggestion)
      setSuggestedBody(res.bodySuggestion)
      setSuggestTips(res.tips)
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

  useEffect(() => {
    if (!showHistory) return
    let abort = false
    setHistoryLoading(true)
    setHistoryError(null)
    fetchHistory()
      .then((items) => {
        if (!abort) {
          setHistory(items)
        }
      })
      .catch((e) => {
        if (!abort) {
          setHistoryError(e instanceof Error ? e.message : String(e))
        }
      })
      .finally(() => {
        if (!abort) {
          setHistoryLoading(false)
        }
      })
    return () => {
      abort = true
    }
  }, [showHistory])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (historyDrawerRef.current && !historyDrawerRef.current.contains(event.target as Node)) {
        setShowHistory(false)
        setEditingHistoryId(null)
      }
    }
    if (showHistory) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showHistory])

  const openHistoryEditor = (item: HistoryItem) => {
    setEditingHistoryId(item.historyId)
    setHistoryDraft({ subject: item.subject, body: item.body })
  }

  const resetHistoryEditor = () => {
    setEditingHistoryId(null)
    setHistoryDraft({ subject: '', body: '' })
  }

  const handleDeleteHistory = async (id: string) => {
    if (!window.confirm(t.historyDeleteConfirm ?? 'この履歴を削除しますか？')) return
    try {
      await deleteHistory(id)
      setHistory((prev) => prev.filter((item) => item.historyId !== id))
      if (editingHistoryId === id) {
        resetHistoryEditor()
      }
    } catch (e) {
      alert(`${t.historyDeleteFailed ?? '削除に失敗しました'}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const handleUpdateHistory = async () => {
    if (!editingHistoryId) return
    try {
      const updated = await updateHistory(editingHistoryId, historyDraft)
      setHistory((prev) => prev.map((item) => (item.historyId === editingHistoryId ? updated : item)))
      resetHistoryEditor()
    } catch (e) {
      alert(`${t.historyUpdateFailed ?? '更新に失敗しました'}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const handleReuseHistory = (item: HistoryItem) => {
    setResult({ subject: item.subject, body: item.body })
    setShowHistory(false)
    resetHistoryEditor()
  }

  return (
    <>
    <div className="wa-app">
      <header className="wa-header">
        <button className="wa-header-menu" aria-label="メニュー" />
        <div className="wa-logo" aria-label={`${t.appName} ロゴ`}>
          <img src={aimailorLogo} alt="AImailor ロゴ" className="wa-logo-image" />
          <span className="wa-logo-text">{t.appName}</span>
        </div>
        <div className="wa-search">
          <span className="wa-search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            className="wa-search-input"
            placeholder={t.searchPlaceholder}
            aria-label="検索"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              generateSuggestions(searchQuery)
              setShowSuggestions(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit()
              }
              if (e.key === 'Escape') {
                setShowSuggestions(false)
              }
            }}
          />
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="wa-search-suggestions">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="wa-search-suggestion"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <span className="wa-suggestion-icon">🔍</span>
                  {suggestion}
                </button>
              ))}
            </div>
          )}
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
          <button className="wa-compose" onClick={() => setView('compose')}>
            <span className="wa-compose-icon" aria-hidden="true" />
            <span>{t.compose}</span>
          </button>

          <nav className="wa-nav-list">
            <a className={`wa-nav-item ${view === 'mailbox' && mailbox === 'inbox' ? 'active' : ''}`} onClick={() => { setView('mailbox'); setMailbox('inbox') }}>
              <span className="wa-nav-icon inbox" aria-hidden="true" />
              <span className="label">{t.inbox}</span>
              <span className="count">{inboxCount}</span>
            </a>
            <a className={`wa-nav-item ${view === 'mailbox' && mailbox === 'starred' ? 'active' : ''}`} onClick={() => { setView('mailbox'); setMailbox('starred') }}>
              <span className="wa-nav-icon star" aria-hidden="true" />
              <span className="label">{t.starred}</span>
            </a>
            <a className={`wa-nav-item ${view === 'mailbox' && mailbox === 'snoozed' ? 'active' : ''}`} onClick={() => { setView('mailbox'); setMailbox('snoozed') }}>
              <span className="wa-nav-icon clock" aria-hidden="true" />
              <span className="label">{t.snoozed}</span>
            </a>
            <a className={`wa-nav-item ${view === 'mailbox' && mailbox === 'sent' ? 'active' : ''}`} onClick={() => { setView('mailbox'); setMailbox('sent') }}>
              <span className="wa-nav-icon send" aria-hidden="true" />
              <span className="label">{t.sent}</span>
            </a>
            <a className={`wa-nav-item ${view === 'mailbox' && mailbox === 'drafts' ? 'active' : ''}`} onClick={() => { setView('mailbox'); setMailbox('drafts') }}>
              <span className="wa-nav-icon file" aria-hidden="true" />
              <span className="label">{t.drafts}</span>
            </a>
            <a className={`wa-nav-item ${view === 'mailbox' && mailbox === 'trash' ? 'active' : ''}`} onClick={() => { setView('mailbox'); setMailbox('trash') }}>
              <span className="wa-nav-icon trash" aria-hidden="true" />
              <span className="label">{t.trash}</span>
            </a>
          </nav>

          <div className="wa-section">
            <div className="wa-subheader">{t.meet}</div>
            <a className="wa-nav-item" onClick={() => { setShowMeetNew(true) }}><span className="wa-nav-icon video" aria-hidden="true" /><span className="label">{t.newMeeting}</span></a>
            <a className="wa-nav-item" onClick={() => { setShowMeetJoin(true); setMeetCode('') }}><span className="wa-nav-icon keyboard" aria-hidden="true" /><span className="label">{t.joinMeeting}</span></a>
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

          {view === 'compose' ? (
          <div className="wa-mail">
            <div className="wa-mail-head">
              <div className="wa-mail-title">
                <div className="title">{result ? result.subject : 'Place for your email content'}</div>
                <div className="tag">{activeMail ? t.mailFolderLabels[activeMail.folder] : t.inbox}</div>
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
                  <div className="wa-context-section">
                    <div className="wa-section-title">{t.contextSectionTitle}</div>
                    <div className="wa-context-layout">
                      <aside className="wa-context-guide">
                        <p className="wa-context-intro">{t.contextIntro}</p>
                        <div className="wa-context-steps">
                          <div className="wa-context-step">
                            <div className="wa-context-step-bullet">1</div>
                            <div className="wa-context-step-content">
                              <div className="wa-context-step-title">{t.contextBasicTitle}</div>
                              <div className="wa-context-step-desc">{t.contextBasicDescription}</div>
                            </div>
                          </div>
                          <div className="wa-context-step">
                            <div className="wa-context-step-bullet">2</div>
                            <div className="wa-context-step-content">
                              <div className="wa-context-step-title">{t.contextAudienceTitle}</div>
                              <div className="wa-context-step-desc">{t.contextAudienceDescription}</div>
                            </div>
                          </div>
                          <div className="wa-context-step">
                            <div className="wa-context-step-bullet">3</div>
                            <div className="wa-context-step-content">
                              <div className="wa-context-step-title">{t.contextActionsTitle}</div>
                              <div className="wa-context-step-desc">{t.contextActionsDescription}</div>
                            </div>
                          </div>
                        </div>
                      </aside>
                      <div className="wa-context-editor">
                        <div className="wa-context-group">
                          <div className="wa-context-group-header">
                            <div className="wa-context-group-title">{t.contextBasicTitle}</div>
                            <div className="wa-context-group-desc">{t.contextBasicDescription}</div>
                          </div>
                          <div className="wa-context-grid">
                            <label className="wa-field">
                              <span className="wa-field-label">{t.jobRoleLabel}</span>
                              <select className="wa-input" value={jobRole} onChange={(e) => setJobRole(e.target.value as JobRole)}>
                                <option value="sales">{t.jobRoleOptions.sales}</option>
                                <option value="support">{t.jobRoleOptions.support}</option>
                                <option value="hr">{t.jobRoleOptions.hr}</option>
                                <option value="dev">{t.jobRoleOptions.dev}</option>
                              </select>
                            </label>
                            <label className="wa-field">
                              <span className="wa-field-label">{t.toneLabel}</span>
                              <select className="wa-input" value={tone} onChange={(e) => setTone(e.target.value as Tone)}>
                                <option value="formal">{t.toneOptions.formal}</option>
                                <option value="neutral">{t.toneOptions.neutral}</option>
                                <option value="friendly">{t.toneOptions.friendly}</option>
                              </select>
                            </label>
                          </div>
                        </div>
                        <div className="wa-context-group">
                          <div className="wa-context-group-header">
                            <div className="wa-context-group-title">{t.contextAudienceTitle}</div>
                            <div className="wa-context-group-desc">{t.contextAudienceDescription}</div>
                          </div>
                          <div className="wa-context-grid">
                            <label className="wa-field">
                              <span className="wa-field-label">{t.departmentLabel}</span>
                              <input className="wa-input" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Sales Team A など" />
                            </label>
                            <label className="wa-field">
                              <span className="wa-field-label">{t.companyStyleLabel}</span>
                              <select className="wa-input" value={companyStyle} onChange={(e) => setCompanyStyle(e.target.value as typeof companyStyle)}>
                                <option value="">-</option>
                                <option value="conservative">{t.companyStyleOptions.conservative}</option>
                                <option value="casual">{t.companyStyleOptions.casual}</option>
                              </select>
                            </label>
                          </div>
                        </div>
                        <div className="wa-context-group">
                          <div className="wa-context-group-header">
                            <div className="wa-context-group-title">{t.contextActionsTitle}</div>
                            <div className="wa-context-group-desc">{t.contextActionsDescription}</div>
                          </div>
                          <div className="wa-context-actions">
                            <button className="wa-btn" onClick={onSuggestWithContext}>{t.suggestedEdits}</button>
                          </div>
                        </div>
                        {(suggestedSubject || suggestedBody) && (
                          <div className="wa-context-group">
                            <div className="wa-context-group-header">
                              <div className="wa-context-group-title">{t.contextSuggestionsTitle}</div>
                              <div className="wa-context-group-desc">{t.contextSuggestionsDescription}</div>
                            </div>
                            <div className="wa-section-box wa-suggest">
                              {suggestedSubject && (
                                <div className="wa-field">
                                  <span className="wa-field-label">{t.subject}</span>
                                  <div className="wa-suggest-row">
                                    <div className="wa-suggest-text">{suggestedSubject}</div>
                                    <button className="wa-btn" onClick={() => setResult((prev) => prev ? { ...prev, subject: suggestedSubject } : prev)}>{t.applySuggestion}</button>
                                  </div>
                                </div>
                              )}
                              {suggestedBody && (
                                <div className="wa-field">
                                  <span className="wa-field-label">{t.body}</span>
                                  <div className="wa-suggest-row">
                                    <textarea className="wa-section-textarea" readOnly value={suggestedBody} />
                                    <button className="wa-btn" onClick={() => setResult((prev) => prev ? { ...prev, body: suggestedBody } : prev)}>{t.applySuggestion}</button>
                                  </div>
                                </div>
                              )}
                              {suggestTips && suggestTips.length > 0 && (
                                <ul className="wa-suggest-tips">
                                  {suggestTips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
          ) : (
            <div className="wa-list">
              {listToShow.length === 0 ? (
                <div className="wa-section-box">{t.mailboxEmpty}</div>
              ) : (
                listToShow.map((m) => (
                      <div
                        className="wa-mailrow"
                        key={m.id}
                        onClick={() => {
                          setView('compose')
                          setResult({ subject: m.subject, body: m.body })
                        }}
                      >
                    <div className="wa-mailrow-main">
                      <button
                        className="wa-mailrow-subject"
                        type="button"
                        aria-label={`${m.subject} を開く`}
                        onClick={(event) => { event.stopPropagation(); handleOpenMail(m) }}
                        dangerouslySetInnerHTML={{ __html: highlightSearchTerms(m.subject, searchQuery) }}
                      />
                      <div 
                        className="wa-mailrow-snippet"
                        dangerouslySetInnerHTML={{ __html: highlightSearchTerms(m.body.slice(0, 150) + (m.body.length > 150 ? '...' : ''), searchQuery) }}
                      />
                    </div>
                    <div className="wa-mailrow-actions">
                      <button className="wa-btn" onClick={(event) => { event.stopPropagation(); toggleStar(m.id) }}>{m.starred ? t.unstar : t.star}</button>
                      {m.folder !== 'trash' && (m.snoozedUntilTs && m.snoozedUntilTs > Date.now() ? (
                        <button className="wa-btn" onClick={(event) => { event.stopPropagation(); unsnooze(m.id) }}>{t.unsnooze}</button>
                      ) : (
                        <button className="wa-btn" onClick={(event) => { event.stopPropagation(); snoozeTomorrow(m.id) }}>{t.snoozeUntilTomorrow}</button>
                      ))}
                      <button className="wa-btn" onClick={(event) => {
                        event.stopPropagation()
                        if (m.folder === 'trash') {
                          restoreFromTrash(m.id)
                        } else {
                          moveToTrash(m.id)
                        }
                      }}>{m.folder === 'trash' ? t.restore : t.moveToTrash}</button>
                      {m.folder === 'trash' && (
                        <button className="wa-btn danger" onClick={(event) => { event.stopPropagation(); permanentlyDelete(m.id) }}>{t.deleteForever}</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        <aside className="wa-appbar">
          <button className="wa-appbtn" aria-label="アプリ1" />
          <button className="wa-appbtn" aria-label="アプリ2" />
          <button className="wa-appbtn" aria-label="アプリ3" />
          <div className="wa-app-sep" />
          <button className="wa-appbtn add" aria-label={t.historyOpen} onClick={() => setShowHistory(true)}>
            <span className="wa-history-icon" aria-hidden="true">🕒</span>
          </button>
        </aside>
      </div>
    </div>

    {showHistory && (
      <div className="wa-history-overlay">
        <div className="wa-history-drawer" ref={historyDrawerRef} role="dialog" aria-modal="true">
          <div className="wa-history-header">
            <h2>{t.historyTitle}</h2>
            <button className="wa-hbtn" aria-label={t.historyClose} onClick={() => { setShowHistory(false); resetHistoryEditor() }}>×</button>
          </div>
          <div className="wa-history-body">
            {historyLoading ? (
              <div className="wa-section-box">{t.historyLoading}</div>
            ) : historyError ? (
              <div className="wa-error">{t.errorLabel}: {historyError}</div>
            ) : history.length === 0 ? (
              <div className="wa-section-box">{t.historyEmpty}</div>
            ) : (
              <ul className="wa-history-list">
                {history.map((item) => (
                  <li key={item.historyId} className="wa-history-item">
                    <div className="wa-history-meta">
                      <div className="wa-history-subject">{item.subject || t.historyNoSubject}</div>
                      <div className="wa-history-timestamp">{item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}</div>
                    </div>
                    <div className="wa-history-actions">
                      <button className="wa-btn" onClick={() => handleReuseHistory(item)}>{t.historyReuse}</button>
                      <button className="wa-btn" onClick={() => openHistoryEditor(item)}>{t.historyEdit}</button>
                      <button className="wa-btn danger" onClick={() => handleDeleteHistory(item.historyId)}>{t.historyDelete}</button>
                    </div>
                    {editingHistoryId === item.historyId && (
                      <div className="wa-history-editor">
                        <label className="wa-field">
                          <span className="wa-field-label">{t.historyEditorSubject}</span>
                          <input className="wa-input" value={historyDraft.subject} onChange={(e) => setHistoryDraft((prev) => ({ ...prev, subject: e.target.value }))} />
                        </label>
                        <label className="wa-field">
                          <span className="wa-field-label">{t.historyEditorBody}</span>
                          <textarea className="wa-section-textarea" value={historyDraft.body} onChange={(e) => setHistoryDraft((prev) => ({ ...prev, body: e.target.value }))} />
                        </label>
                        <div className="wa-history-editor-actions">
                          <button className="wa-btn" onClick={handleUpdateHistory}>{t.historyEditorSave}</button>
                          <button className="wa-btn" onClick={resetHistoryEditor}>{t.historyEditorCancel}</button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    )}

    {/* Meet New Modal */}
    {showMeetNew && (
      <div className="wa-modal" role="dialog" aria-modal="true">
        <div className="wa-modal-content">
          <div className="wa-modal-title">Google Meet</div>
          <div className="wa-modal-body">{t.meetNewConfirm}</div>
          <div className="wa-modal-actions">
            <button className="wa-btn" onClick={() => setShowMeetNew(false)}>{t.cancel}</button>
            <button className="wa-btn primary" onClick={() => {
              window.open('https://meet.google.com/new', '_blank')
              setShowMeetNew(false)
            }}>{t.openInNewTab}</button>
          </div>
        </div>
      </div>
    )}

    {/* Meet Join Modal */}
    {showMeetJoin && (
      <div className="wa-modal" role="dialog" aria-modal="true">
        <div className="wa-modal-content">
          <div className="wa-modal-title">Google Meet</div>
          <div className="wa-modal-body">
            <label className="wa-field">
              <span className="wa-field-label">{t.meetCodeOrLink}</span>
              <input className="wa-input" placeholder={t.meetCodePlaceholder} value={meetCode} onChange={(e) => setMeetCode(e.target.value)} />
            </label>
          </div>
          <div className="wa-modal-actions">
            <button className="wa-btn" onClick={() => setShowMeetJoin(false)}>{t.cancel}</button>
            <button className="wa-btn primary" disabled={!meetCode.trim()} onClick={() => {
              const code = extractMeetCodeOrUrl(meetCode.trim())
              if (code) {
                const url = code.startsWith('http') ? code : `https://meet.google.com/${code}`
                window.open(url, '_blank')
                setShowMeetJoin(false)
              }
            }}>{t.joinNow}</button>
          </div>
        </div>
      </div>
    )}

    </>
  )
}

export default App
