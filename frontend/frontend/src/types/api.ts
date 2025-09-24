export type GenerateEmailRequest = {
  keywords: string[]
  recipient?: string
}

export type GenerateEmailResponse = {
  subject: string
  body: string
}

export type SaveHistoryRequest = {
  userId?: string
  emailBody: string
  subject?: string
}

export type SaveHistoryResponse = {
  historyId: string
  isDuplicate?: boolean
  similarityScore?: number
  duplicateOfId?: string
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

