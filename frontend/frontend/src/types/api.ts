export type GenerateEmailRequest = {
  keywords: string[]
  recipient?: string
}

export type GenerateEmailResponse = {
  subject: string
  body: string
}

export type SaveHistoryRequest = {
  user?: string
  subject: string
  body: string
  timestamp?: string
}

export type SaveHistoryResponse = {
  historyId: string
  subject: string
  body: string
  user?: string
  timestamp?: string
  isDuplicate?: boolean
  similarityScore?: number
  duplicateOfId?: string
}

export type HistoryItem = SaveHistoryResponse

export type UpdateHistoryRequest = {
  subject?: string
  body?: string
  user?: string
  timestamp?: string
}

export type SlackIntegrationRequest = {
  message: string
  channelId: string
}

export type SlackIntegrationResponse = {
  status: 'ok' | 'error'
  ts?: string
  errorMessage?: string
}

export type OutlookIntegrationRequest = {
  recipient: string
  subject: string
  body: string
}

export type OutlookIntegrationResponse = {
  status: 'ok' | 'error'
  messageId?: string
  errorMessage?: string
}

export type GoogleCalendarIntegrationRequest = {
  title: string
  startIso: string
  endIso: string
  attendees?: string[]
  description?: string
}

export type GoogleCalendarIntegrationResponse = {
  status: 'ok' | 'error'
  eventId?: string
  errorMessage?: string
}

// ========== Context AI Types ==========
export type JobRole = 'sales' | 'support' | 'hr' | 'dev'

export type Tone = 'formal' | 'neutral' | 'friendly'

export type CompanyStyle = 'conservative' | 'casual'

export type ContextSettings = {
  jobRole: JobRole
  tone: Tone
  department?: string
  companyStyle?: CompanyStyle
}

export type SuggestWithContextRequest = {
  settings: ContextSettings
  subject: string
  body: string
  historySample?: string[]
}

export type SuggestWithContextResponse = {
  subjectSuggestion?: string
  bodySuggestion: string
  tips?: string[]
}

