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
}

