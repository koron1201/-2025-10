export type Language = 'ja' | 'en' | 'ko' | 'zh'

export interface Translations {
  // Header
  appName: string
  searchPlaceholder: string
  
  // Sidebar Navigation
  compose: string
  inbox: string
  starred: string
  snoozed: string
  sent: string
  drafts: string
  meet: string
  newMeeting: string
  joinMeeting: string
  hangouts: string
  noRecentChats: string
  startNewChat: string
  
  // Mail Content
  subject: string
  body: string
  senderName: string
  unsubscribe: string
  toMe: string
  
  // Form Labels
  recipientOptional: string
  recipientPlaceholder: string
  keywordsLabel: string
  keywordsPlaceholder: string
  generateEmail: string
  generating: string
  saveToHistory: string
  
  // Mock Mode
  mockMode: string
  
  // Results
  savedToHistory: string
  duplicateWarning: string
  errorLabel: string
  
  // Integration
  shareWithExternalApps: string
  slack: string
  outlook: string
  googleCalendar: string
  
  // Slack Integration
  channelId: string
  channelIdPlaceholder: string
  additionalMessage: string
  additionalMessagePlaceholder: string
  sendToSlack: string
  
  // Outlook Integration
  emailRecipient: string
  emailRecipientPlaceholder: string
  sendWithOutlook: string
  
  // Calendar Integration
  eventTitle: string
  eventTitlePlaceholder: string
  startDateTime: string
  endDateTime: string
  attendees: string
  attendeesPlaceholder: string
  createEvent: string
  
  // Status Messages
  sendSuccess: string
  sendFailure: string
  eventCreated: string
  eventFailed: string
  
  // Toolbar
  pageInfo: string
  
  // Language
  language: string
}

export const translations: Record<Language, Translations> = {
  ja: {
    appName: 'WAMail',
    searchPlaceholder: 'メールを検索',
    
    compose: '作成',
    inbox: '受信トレイ',
    starred: 'スター付き',
    snoozed: 'スヌーズ中',
    sent: '送信済み',
    drafts: '下書き',
    meet: 'Meet',
    newMeeting: '新しい会議',
    joinMeeting: '会議に参加',
    hangouts: 'ハングアウト',
    noRecentChats: '最近のチャットなし',
    startNewChat: '新しいチャットを開始',
    
    subject: '件名',
    body: '本文',
    senderName: '送信者名',
    unsubscribe: '配信停止',
    toMe: 'to me',
    
    recipientOptional: '受信者（任意）',
    recipientPlaceholder: '例: tanaka@example.com',
    keywordsLabel: 'キーワード（カンマ区切り）',
    keywordsPlaceholder: '例: 見積, 今週金曜, 議事録',
    generateEmail: 'メールを作成',
    generating: '生成中…',
    saveToHistory: '履歴に保存',
    
    mockMode: 'モックモード（バックエンド不要）',
    
    savedToHistory: '履歴に保存しました',
    duplicateWarning: '過去に似た内容のメールが保存されています。内容を確認してから送信してください。',
    errorLabel: 'エラー',
    
    shareWithExternalApps: '外部アプリに共有',
    slack: 'Slack',
    outlook: 'Outlook',
    googleCalendar: 'Google Calendar',
    
    channelId: 'チャンネルID',
    channelIdPlaceholder: '例: C0123456 または general',
    additionalMessage: 'メッセージ（任意に追記）',
    additionalMessagePlaceholder: '件名+本文に追記したい内容',
    sendToSlack: 'Slackに送信',
    
    emailRecipient: '宛先（メールアドレス）',
    emailRecipientPlaceholder: '例: tanaka@example.com',
    sendWithOutlook: 'Outlookで送信',
    
    eventTitle: 'タイトル',
    eventTitlePlaceholder: '例: 打ち合わせ',
    startDateTime: '開始日時',
    endDateTime: '終了日時',
    attendees: '参加者（カンマ区切り）',
    attendeesPlaceholder: '例: sato@example.com,suzuki@example.com',
    createEvent: '予定を作成',
    
    sendSuccess: '送信成功',
    sendFailure: '失敗',
    eventCreated: '作成成功',
    eventFailed: '失敗',
    
    pageInfo: 'of',
    
    language: '言語'
  },
  
  en: {
    appName: 'WAMail',
    searchPlaceholder: 'Search mail',
    
    compose: 'Compose',
    inbox: 'Inbox',
    starred: 'Starred',
    snoozed: 'Snoozed',
    sent: 'Sent',
    drafts: 'Drafts',
    meet: 'Meet',
    newMeeting: 'New meeting',
    joinMeeting: 'Join a meeting',
    hangouts: 'Hangouts',
    noRecentChats: 'No recent chats',
    startNewChat: 'Start a new one',
    
    subject: 'Subject',
    body: 'Body',
    senderName: 'Sender Name',
    unsubscribe: 'Unsubscribe',
    toMe: 'to me',
    
    recipientOptional: 'Recipient (optional)',
    recipientPlaceholder: 'e.g., tanaka@example.com',
    keywordsLabel: 'Keywords (comma-separated)',
    keywordsPlaceholder: 'e.g., quote, this Friday, meeting notes',
    generateEmail: 'Generate Email',
    generating: 'Generating…',
    saveToHistory: 'Save to History',
    
    mockMode: 'Mock Mode (No Backend Required)',
    
    savedToHistory: 'Saved to history',
    duplicateWarning: 'Similar content has been saved before. Please review before sending.',
    errorLabel: 'Error',
    
    shareWithExternalApps: 'Share with External Apps',
    slack: 'Slack',
    outlook: 'Outlook',
    googleCalendar: 'Google Calendar',
    
    channelId: 'Channel ID',
    channelIdPlaceholder: 'e.g., C0123456 or general',
    additionalMessage: 'Additional Message (optional)',
    additionalMessagePlaceholder: 'Additional content to append to subject+body',
    sendToSlack: 'Send to Slack',
    
    emailRecipient: 'Email Recipient',
    emailRecipientPlaceholder: 'e.g., tanaka@example.com',
    sendWithOutlook: 'Send with Outlook',
    
    eventTitle: 'Title',
    eventTitlePlaceholder: 'e.g., Meeting',
    startDateTime: 'Start Date & Time',
    endDateTime: 'End Date & Time',
    attendees: 'Attendees (comma-separated)',
    attendeesPlaceholder: 'e.g., sato@example.com,suzuki@example.com',
    createEvent: 'Create Event',
    
    sendSuccess: 'Send Success',
    sendFailure: 'Failed',
    eventCreated: 'Created Successfully',
    eventFailed: 'Failed',
    
    pageInfo: 'of',
    
    language: 'Language'
  },
  
  ko: {
    appName: 'WAMail',
    searchPlaceholder: '메일 검색',
    
    compose: '작성',
    inbox: '받은편지함',
    starred: '중요편지함',
    snoozed: '다시알림',
    sent: '보낸편지함',
    drafts: '임시보관함',
    meet: 'Meet',
    newMeeting: '새 회의',
    joinMeeting: '회의 참가',
    hangouts: '행아웃',
    noRecentChats: '최근 채팅 없음',
    startNewChat: '새로 시작하기',
    
    subject: '제목',
    body: '본문',
    senderName: '보낸사람',
    unsubscribe: '구독취소',
    toMe: '받는사람: 나',
    
    recipientOptional: '받는사람 (선택사항)',
    recipientPlaceholder: '예: tanaka@example.com',
    keywordsLabel: '키워드 (쉼표로 구분)',
    keywordsPlaceholder: '예: 견적서, 이번 금요일, 회의록',
    generateEmail: '이메일 생성',
    generating: '생성 중…',
    saveToHistory: '기록에 저장',
    
    mockMode: '모의 모드 (백엔드 불필요)',
    
    savedToHistory: '기록에 저장되었습니다',
    duplicateWarning: '비슷한 내용이 이전에 저장되었습니다. 전송 전에 내용을 확인하세요.',
    errorLabel: '오류',
    
    shareWithExternalApps: '외부 앱과 공유',
    slack: 'Slack',
    outlook: 'Outlook',
    googleCalendar: 'Google Calendar',
    
    channelId: '채널 ID',
    channelIdPlaceholder: '예: C0123456 또는 general',
    additionalMessage: '추가 메시지 (선택사항)',
    additionalMessagePlaceholder: '제목+본문에 추가할 내용',
    sendToSlack: 'Slack으로 보내기',
    
    emailRecipient: '이메일 받는사람',
    emailRecipientPlaceholder: '예: tanaka@example.com',
    sendWithOutlook: 'Outlook으로 보내기',
    
    eventTitle: '제목',
    eventTitlePlaceholder: '예: 회의',
    startDateTime: '시작 날짜 및 시간',
    endDateTime: '종료 날짜 및 시간',
    attendees: '참석자 (쉼표로 구분)',
    attendeesPlaceholder: '예: sato@example.com,suzuki@example.com',
    createEvent: '일정 만들기',
    
    sendSuccess: '전송 성공',
    sendFailure: '실패',
    eventCreated: '생성 성공',
    eventFailed: '실패',
    
    pageInfo: '의',
    
    language: '언어'
  },
  
  zh: {
    appName: 'WAMail',
    searchPlaceholder: '搜索邮件',
    
    compose: '撰写',
    inbox: '收件箱',
    starred: '已加星标',
    snoozed: '已延后',
    sent: '已发送',
    drafts: '草稿',
    meet: 'Meet',
    newMeeting: '新会议',
    joinMeeting: '加入会议',
    hangouts: '环聊',
    noRecentChats: '暂无最近聊天',
    startNewChat: '开始新聊天',
    
    subject: '主题',
    body: '正文',
    senderName: '发件人姓名',
    unsubscribe: '取消订阅',
    toMe: '发送给我',
    
    recipientOptional: '收件人（可选）',
    recipientPlaceholder: '例：tanaka@example.com',
    keywordsLabel: '关键词（逗号分隔）',
    keywordsPlaceholder: '例：报价单，本周五，会议记录',
    generateEmail: '生成邮件',
    generating: '生成中…',
    saveToHistory: '保存到历史记录',
    
    mockMode: '模拟模式（无需后端）',
    
    savedToHistory: '已保存到历史记录',
    duplicateWarning: '之前已保存过类似内容。发送前请确认内容。',
    errorLabel: '错误',
    
    shareWithExternalApps: '与外部应用分享',
    slack: 'Slack',
    outlook: 'Outlook',
    googleCalendar: 'Google Calendar',
    
    channelId: '频道 ID',
    channelIdPlaceholder: '例：C0123456 或 general',
    additionalMessage: '附加消息（可选）',
    additionalMessagePlaceholder: '要添加到主题+正文的内容',
    sendToSlack: '发送到 Slack',
    
    emailRecipient: '邮件收件人',
    emailRecipientPlaceholder: '例：tanaka@example.com',
    sendWithOutlook: '使用 Outlook 发送',
    
    eventTitle: '标题',
    eventTitlePlaceholder: '例：会议',
    startDateTime: '开始日期和时间',
    endDateTime: '结束日期和时间',
    attendees: '参会者（逗号分隔）',
    attendeesPlaceholder: '例：sato@example.com,suzuki@example.com',
    createEvent: '创建日程',
    
    sendSuccess: '发送成功',
    sendFailure: '失败',
    eventCreated: '创建成功',
    eventFailed: '失败',
    
    pageInfo: ' 的',
    
    language: '语言'
  }
}

export const languageNames: Record<Language, string> = {
  ja: '日本語',
  en: 'English',
  ko: '한국어',
  zh: '中文'
}

// Get browser language or default to Japanese
export function getDefaultLanguage(): Language {
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('en')) return 'en'
  if (browserLang.startsWith('ko')) return 'ko'  
  if (browserLang.startsWith('zh')) return 'zh'
  return 'ja' // Default to Japanese
}
