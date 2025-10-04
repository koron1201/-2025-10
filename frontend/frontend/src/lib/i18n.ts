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
  trash: string
  meet: string
  newMeeting: string
  joinMeeting: string
  mailFolderLabels: Record<'inbox' | 'sent' | 'drafts' | 'trash', string>

  // Mail Content
  subject: string
  body: string
  senderName: string
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

  // Context AI
  contextSectionTitle: string
  jobRoleLabel: string
  jobRoleOptions: { sales: string; support: string; hr: string; dev: string }
  toneLabel: string
  toneOptions: { formal: string; neutral: string; friendly: string }
  departmentLabel: string
  companyStyleLabel: string
  companyStyleOptions: { conservative: string; casual: string }
  suggestedEdits: string
  applySuggestion: string

  // Meet Dialog
  meetNewConfirm: string
  meetCodeOrLink: string
  meetCodePlaceholder: string
  openInNewTab: string
  joinNow: string
  cancel: string

  // Mailbox/Browse
  mailboxEmpty: string
  snoozeUntilTomorrow: string
  unsnooze: string
  star: string
  unstar: string
  moveToTrash: string
  restore: string
  deleteForever: string

  // Context helper copy
  contextIntro: string
  contextBasicTitle: string
  contextBasicDescription: string
  contextAudienceTitle: string
  contextAudienceDescription: string
  contextActionsTitle: string
  contextActionsDescription: string
  contextSuggestionsTitle: string
  contextSuggestionsDescription: string
  historyTitle: string
  historyOpen: string
  historyClose: string
  historyLoading: string
  historyEmpty: string
  historyNoSubject: string
  historyReuse: string
  historyEdit: string
  historyDelete: string
  historyDeleteConfirm: string
  historyDeleteFailed: string
  historyUpdateFailed: string
  historyEditorSubject: string
  historyEditorBody: string
  historyEditorSave: string
  historyEditorCancel: string
}

export const translations: Record<Language, Translations> = {
  ja: {
    appName: 'AImailor',
    searchPlaceholder: 'メールを検索',
    
    compose: '作成',
    inbox: '受信トレイ',
    starred: 'スター付き',
    snoozed: 'スヌーズ中',
    sent: '送信済み',
    drafts: '下書き',
    trash: 'ゴミ箱',
    meet: 'Meet',
    newMeeting: '新しい会議',
    joinMeeting: '会議に参加',
    mailFolderLabels: {
      inbox: '受信トレイ',
      sent: '送信済み',
      drafts: '下書き',
      trash: 'ゴミ箱'
    },
    subject: '件名',
    body: '本文',
    senderName: '送信者名',
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
    
    language: '言語',

    // Context AI
    contextSectionTitle: 'コンテキストAI',
    jobRoleLabel: '職種',
    jobRoleOptions: { sales: '営業', support: 'カスタマーサポート', hr: '人事', dev: '開発' },
    toneLabel: 'トーン',
    toneOptions: { formal: 'フォーマル', neutral: 'ニュートラル', friendly: 'フレンドリー' },
    departmentLabel: '部署（任意）',
    companyStyleLabel: '社内文化（任意）',
    companyStyleOptions: { conservative: 'かため', casual: 'カジュアル' },
    suggestedEdits: 'サジェスト',
    applySuggestion: '反映'

    ,
    // Meet Dialog
    meetNewConfirm: 'Google Meet を新しいタブで開きます',
    meetCodeOrLink: '会議コードまたはリンク',
    meetCodePlaceholder: '例: abc-defg-hij または https://meet.google.com/...',
    openInNewTab: '新しいタブで開く',
    joinNow: '参加',
    cancel: 'キャンセル'

    ,
    // Mailbox/Browse
    mailboxEmpty: 'メールがありません',
    snoozeUntilTomorrow: '明日までスヌーズ',
    unsnooze: 'スヌーズ解除',
    star: 'スター',
    unstar: 'スター解除',
    moveToTrash: 'ゴミ箱へ移動',
    restore: '復元',
    deleteForever: '完全に削除',

    contextIntro: 'キーワードを入力したら、以下のステップの項目を順番に設定していきましょう。',
    contextBasicTitle: '基本情報を選択',
    contextBasicDescription: 'キーワード入力後、まずは職種とトーンを選んで想定読者に合った文体に整えます。',
    contextAudienceTitle: '宛先や社内文化を補足',
    contextAudienceDescription: '次に部署名や社内文化を入力すると、本文がさらに調整されます。',
    contextActionsTitle: 'アクションを実行',
    contextActionsDescription: '最後に改善提案を確認して、文面を磨きます。',
    contextSuggestionsTitle: '改善提案',
    contextSuggestionsDescription: '提案を確認し、よければワンクリックで反映しましょう。',
    historyTitle: '履歴',
    historyOpen: '履歴を開く',
    historyClose: '履歴を閉じる',
    historyLoading: '読み込み中…',
    historyEmpty: '保存された履歴はまだありません。',
    historyNoSubject: '(件名なし)',
    historyReuse: '再利用',
    historyEdit: '編集',
    historyDelete: '削除',
    historyDeleteConfirm: 'この履歴を削除しますか？',
    historyDeleteFailed: '削除に失敗しました',
    historyUpdateFailed: '更新に失敗しました',
    historyEditorSubject: '件名',
    historyEditorBody: '本文',
    historyEditorSave: '保存',
    historyEditorCancel: 'キャンセル'
  },
  
  en: {
    appName: 'AImailor',
    searchPlaceholder: 'Search mail',
    
    compose: 'Compose',
    inbox: 'Inbox',
    starred: 'Starred',
    snoozed: 'Snoozed',
    sent: 'Sent',
    drafts: 'Drafts',
    trash: 'Trash',
    meet: 'Meet',
    newMeeting: 'New meeting',
    joinMeeting: 'Join a meeting',
    mailFolderLabels: {
      inbox: 'Inbox',
      sent: 'Sent',
      drafts: 'Drafts',
      trash: 'Trash'
    },
    subject: 'Subject',
    body: 'Body',
    senderName: 'Sender Name',
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
    
    language: 'Language',

    // Context AI
    contextSectionTitle: 'Context AI',
    jobRoleLabel: 'Job Role',
    jobRoleOptions: { sales: 'Sales', support: 'Support', hr: 'HR', dev: 'Development' },
    toneLabel: 'Tone',
    toneOptions: { formal: 'Formal', neutral: 'Neutral', friendly: 'Friendly' },
    departmentLabel: 'Department (optional)',
    companyStyleLabel: 'Company Style (optional)',
    companyStyleOptions: { conservative: 'Conservative', casual: 'Casual' },
    suggestedEdits: 'Suggestions',
    applySuggestion: 'Apply'

    ,
    // Meet Dialog
    meetNewConfirm: 'Open Google Meet in a new tab',
    meetCodeOrLink: 'Meeting code or link',
    meetCodePlaceholder: 'e.g., abc-defg-hij or https://meet.google.com/...',
    openInNewTab: 'Open in new tab',
    joinNow: 'Join',
    cancel: 'Cancel'

    ,
    // Mailbox/Browse
    mailboxEmpty: 'No emails',
    snoozeUntilTomorrow: 'Snooze until tomorrow',
    unsnooze: 'Unsnooze',
    star: 'Star',
    unstar: 'Unstar',
    moveToTrash: 'Move to trash',
    restore: 'Restore',
    deleteForever: 'Delete forever',

    contextIntro: 'After entering keywords, follow these steps to tailor the generated email.',
    contextBasicTitle: 'Choose the basics',
    contextBasicDescription: 'First, pick the job role and tone to match the expected style.',
    contextAudienceTitle: 'Add audience context',
    contextAudienceDescription: 'Next, provide department or company culture for more precise wording.',
    contextActionsTitle: 'Run refinements',
    contextActionsDescription: 'Finally, review contextual suggestions to polish the draft.',
    contextSuggestionsTitle: 'Suggested improvements',
    contextSuggestionsDescription: 'Review and apply recommended subjects or bodies instantly.',
    historyTitle: 'History',
    historyOpen: 'Open history',
    historyClose: 'Close history',
    historyLoading: 'Loading…',
    historyEmpty: 'No saved history yet.',
    historyNoSubject: '(No subject)',
    historyReuse: 'Reuse',
    historyEdit: 'Edit',
    historyDelete: 'Delete',
    historyDeleteConfirm: 'Delete this history entry?',
    historyDeleteFailed: 'Failed to delete history',
    historyUpdateFailed: 'Failed to update history',
    historyEditorSubject: 'Subject',
    historyEditorBody: 'Body',
    historyEditorSave: 'Save',
    historyEditorCancel: 'Cancel'
  },
  
  ko: {
    appName: 'AImailor',
    searchPlaceholder: '메일 검색',
    
    compose: '작성',
    inbox: '받은편지함',
    starred: '중요편지함',
    snoozed: '다시알림',
    sent: '보낸편지함',
    drafts: '임시보관함',
    trash: '휴지통',
    meet: 'Meet',
    newMeeting: '새 회의',
    joinMeeting: '회의 참가',
    mailFolderLabels: {
      inbox: '받은편지함',
      sent: '보낸편지함',
      drafts: '임시보관함',
      trash: '휴지통'
    },
    subject: '제목',
    body: '본문',
    senderName: '보낸사람',
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
    
    language: '언어',

    // Context AI
    contextSectionTitle: '컨텍스트 AI',
    jobRoleLabel: '직무',
    jobRoleOptions: { sales: '영업', support: '고객지원', hr: '인사', dev: '개발' },
    toneLabel: '톤',
    toneOptions: { formal: '격식', neutral: '중립', friendly: '친근' },
    departmentLabel: '부서(선택사항)',
    companyStyleLabel: '사내 문화(선택사항)',
    companyStyleOptions: { conservative: '보수적', casual: '캐주얼' },
    suggestedEdits: '제안',
    applySuggestion: '반영'

    ,
    // Meet Dialog
    meetNewConfirm: 'Google Meet 를 새 탭에서 엽니다',
    meetCodeOrLink: '회의 코드 또는 링크',
    meetCodePlaceholder: '예: abc-defg-hij 또는 https://meet.google.com/...',
    openInNewTab: '새 탭에서 열기',
    joinNow: '참가',
    cancel: '취소'

    ,
    // Mailbox/Browse
    mailboxEmpty: '메일이 없습니다',
    snoozeUntilTomorrow: '내일까지 미루기',
    unsnooze: '미루기 해제',
    star: '중요 표시',
    unstar: '중요 해제',
    moveToTrash: '휴지통으로 이동',
    restore: '복원',
    deleteForever: '완전히 삭제',

    contextIntro: '키워드를 입력한 다음, 아래 단계를 순서대로 진행하면 더 알맞은 이메일 제안을 받을 수 있어요.',
    contextBasicTitle: '기본 정보 선택',
    contextBasicDescription: '먼저 직무와 톤을 선택해 기대하는 문체에 맞춥니다.',
    contextAudienceTitle: '대상 정보 추가',
    contextAudienceDescription: '다음으로 부서나 사내 문화를 입력하면 문장이 더욱 정교해집니다.',
    contextActionsTitle: '다음 작업 실행',
    contextActionsDescription: '마지막으로 맞춤 제안을 확인하며 문장을 다듬어 주세요.',
    contextSuggestionsTitle: '개선 제안',
    contextSuggestionsDescription: '제안을 검토하고 마음에 들면 즉시 반영하세요.',
    historyTitle: '히스토리',
    historyOpen: '히스토리 열기',
    historyClose: '히스토리 닫기',
    historyLoading: '불러오는 중…',
    historyEmpty: '저장된 히스토리가 아직 없습니다.',
    historyNoSubject: '(제목 없음)',
    historyReuse: '재사용',
    historyEdit: '편집',
    historyDelete: '삭제',
    historyDeleteConfirm: '이 히스토리를 삭제하시겠습니까?',
    historyDeleteFailed: '히스토리 삭제에 실패했습니다',
    historyUpdateFailed: '히스토리 업데이트에 실패했습니다',
    historyEditorSubject: '제목',
    historyEditorBody: '본문',
    historyEditorSave: '저장',
    historyEditorCancel: '취소'
  },
  
  zh: {
    appName: 'AImailor',
    searchPlaceholder: '搜索邮件',
    
    compose: '撰写',
    inbox: '收件箱',
    starred: '已加星标',
    snoozed: '已延后',
    sent: '已发送',
    drafts: '草稿',
    trash: '回收站',
    meet: 'Meet',
    newMeeting: '新会议',
    joinMeeting: '加入会议',
    mailFolderLabels: {
      inbox: '收件箱',
      sent: '已发送',
      drafts: '草稿',
      trash: '回收站'
    },
    subject: '主题',
    body: '正文',
    senderName: '发件人姓名',
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
    
    language: '语言',

    // Context AI
    contextSectionTitle: '上下文 AI',
    jobRoleLabel: '职能',
    jobRoleOptions: { sales: '销售', support: '客服', hr: '人力', dev: '开发' },
    toneLabel: '语气',
    toneOptions: { formal: '正式', neutral: '中性', friendly: '友好' },
    departmentLabel: '部门（可选）',
    companyStyleLabel: '公司风格（可选）',
    companyStyleOptions: { conservative: '保守', casual: '随意' },
    suggestedEdits: '建议',
    applySuggestion: '应用'

    ,
    // Meet Dialog
    meetNewConfirm: '在新标签页中打开 Google Meet',
    meetCodeOrLink: '会议代码或链接',
    meetCodePlaceholder: '例：abc-defg-hij 或 https://meet.google.com/...',
    openInNewTab: '在新标签页打开',
    joinNow: '加入',
    cancel: '取消'

    ,
    // Mailbox/Browse
    mailboxEmpty: '暂无邮件',
    snoozeUntilTomorrow: '延后到明天',
    unsnooze: '取消延后',
    star: '加星标',
    unstar: '取消星标',
    moveToTrash: '移到回收站',
    restore: '还原',
    deleteForever: '永久删除',

    contextIntro: '输入关键词后，按以下步骤依次完善内容，以获得更贴切的邮件建议。',
    contextBasicTitle: '选择基本信息',
    contextBasicDescription: '首先选择职能和语气，以匹配期望的文体。',
    contextAudienceTitle: '补充收件人背景',
    contextAudienceDescription: '然后输入部门或公司风格，可进一步微调正文。',
    contextActionsTitle: '执行优化操作',
    contextActionsDescription: '最后查看上下文建议，对邮件进行润色。',
    contextSuggestionsTitle: '改进建议',
    contextSuggestionsDescription: '查看推荐的主题和正文，满意即可一键应用。',
    historyTitle: '历史',
    historyOpen: '打开历史',
    historyClose: '关闭历史',
    historyLoading: '加载中…',
    historyEmpty: '暂无历史记录',
    historyNoSubject: '(无主题)',
    historyReuse: '再利用',
    historyEdit: '编辑',
    historyDelete: '删除',
    historyDeleteConfirm: '确定要删除此历史记录吗？',
    historyDeleteFailed: '删除失败',
    historyUpdateFailed: '更新失败',
    historyEditorSubject: '主题',
    historyEditorBody: '正文',
    historyEditorSave: '保存',
    historyEditorCancel: '取消'
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
