# ビジネスメールAIアプリ

## プロジェクト概要

ビジネスメールの作成をAIが支援するアプリケーションです。特定のキーワードからメール内容を自動生成し、時候の挨拶や書式の提案、過去の文章記録による重複防止、外部アプリとの連携機能を提供します。

## 主要機能

### 基本機能
- **キーワード入力によるメール自動生成**: 特定のキーワードを入力すると、AIがメールの内容を作成
- **時候の挨拶・書式提案**: ビジネスシーンに適した挨拶文やメール書式の自動提案
- **履歴保存と重複防止**: 過去の文章を記録し、メール文の重複を防止
- **外部アプリ連携**: Slack、Outlook、Googleカレンダーなどとの連携

### 独自機能（コンテキストAI）
- **業界特化型テンプレート**: 職種（セールス、カスタマーサポート、人事、開発）ごとの専門テンプレート
- **パーソナライズされたサジェスト**: ユーザーの職種や部署に応じた表現・テンプレートの優先順位調整
- **社内文化学習**: 組織特有の言葉遣いや表現を学習し、自然なコミュニケーションを促進

### 追加機能（GPT提案）
- **感情分析とトーン調整**: メールの感情的なトーンを分析し、ビジネスシーンに適切な表現に自動調整
- **多言語対応とリアルタイム翻訳**: 主要言語への自動翻訳と文化的なビジネスマナー考慮
- **相手の性格・役職分析**: 過去のメール履歴から相手の特徴を分析し、最適な敬語レベルや表現スタイルを提案
- **音声入力とリアルタイム文字起こし**: 音声でメール内容を入力し、ビジネスメール形式に自動整形
- **スケジュール統合と自動日程調整**: Googleカレンダーと連携し、会議の空き時間を自動で探して調整メールを生成
- **AIによる緊急度・重要度判定**: 受信メールの緊急度を自動判定し、返信期限を提案

## 技術スタック

- **フロントエンド**: React.js
- **バックエンド**: Java (Spring Boot)
- **データベース**: MySQL/PostgreSQL
- **バージョン管理**: Git

## 開発ロードマップ

### 1. プロジェクト初期設定
- [ ] React.jsプロジェクトのセットアップ（Create React App/Vite）
- [ ] Spring Bootプロジェクトの作成（Maven/Gradle）
- [ ] データベースのセットアップ（MySQL/PostgreSQL）
- [ ] Gitリポジトリの初期化

### 2. MVP（最小限の機能）開発
- [ ] **メール生成API** (`POST /api/emails/generate`)
  - キーワードからAIモデル（OpenAI API/Vertex AI）を呼び出してメール本文を生成
- [ ] **履歴保存API** (`POST /api/emails/history`)
  - 作成されたメールをデータベースに保存
- [ ] **フロントエンドUI**
  - キーワード入力テキストボックス
  - 「メールを作成」ボタン
  - 生成されたメール本文の表示画面
- [ ] **API連携**
  - フロントエンドとバックエンドの連携処理

### 3. 主要機能の追加開発
- [ ] **時候の挨拶・書式テンプレート機能**
  - `GET /api/templates/greetings` APIの実装
  - 季節や目的に応じた挨拶文のデータベース管理
  - フロントエンドでの挨拶文選択UI
- [ ] **重複防止機能**
  - 履歴APIの拡張（類似度比較ロジック）
  - 重複検出時の警告表示UI
- [ ] **外部アプリ連携機能**
  - Slack Web API連携 (`POST /api/integrations/slack`)
  - Microsoft Graph API連携（Outlook）
  - Google Calendar API連携
  - 連携設定画面とワンクリック送信機能

### 4. 独自機能（コンテキストAI）の実装
- [ ] **業界・職種特化型テンプレート**
  - 職種別テンプレートのデータベース設計
  - 初期設定での職種選択機能
- [ ] **パーソナライズされたサジェスト機能**
  - ユーザー職種・履歴分析ロジック
  - AIモデルのファインチューニング
- [ ] **社内文化学習機能**
  - Slack/Outlook連携データの分析
  - 組織特有の表現学習システム

### 5. テストとデプロイ
- [ ] **テスト**
  - ユニットテスト
  - 結合テスト
  - UIテスト
- [ ] **デプロイ**
  - バックエンド: Heroku/AWS Elastic Beanstalk/Google App Engine
  - フロントエンド: Vercel/Netlify/AWS S3 + CloudFront

## API設計

| API名 | 概要 | メソッド・パス | リクエスト例 | レスポンス例 |
|-------|------|----------------|--------------|--------------|
| メール生成API | メール文自動生成 | `POST /api/emails/generate` | `{ keywords: [], recipient: ... }` | `{ subject, body }` |
| 挨拶&書式API | 挨拶・書式テンプレート取得 | `GET /api/templates/greetings` | `{ season, region }` | `{ greeting }` |
| 履歴保存API | 作成メール文の保存と重複判定 | `POST /api/emails/history` | `{ userId, emailBody }` | `{ historyId, isDuplicate }` |
| 連携API | Slack/Outlook連携 | `POST /api/integrations/slack` | `{ message, channelId }` | `{ status }` |
| 感情分析API | メール内容トーン分析・修正案 | `POST /api/emails/analyze-tone` | `{ body }` | `{ score, suggestedBody }` |
| 翻訳API | メール内容の自動翻訳 | `POST /api/emails/translate` | `{ body, targetLang }` | `{ translatedBody }` |
| パーソナリティ分析API | 相手特徴解析・敬語/スタイル提案 | `POST /api/personality/analyze` | `{ recipientEmail, emailHistory }` | `{ persona, toneSuggestion }` |
| 音声入力API | 音声→テキスト変換 | `POST /api/emails/speech-to-text` | `{ audioFile }` | `{ text }` |
| スケジュールAPI | 会議自動調整メール生成 | `POST /api/schedule/meetings` | `{ calendarId, attendees }` | `{ suggestedSlots, emailDraft }` |
| 緊急度判定API | メール重要度・期限判定 | `POST /api/emails/urgency` | `{ subject, body }` | `{ urgencyLevel, deadline }` |
| フォローアップAPI | 重要メール自動フォロー設定 | `POST /api/emails/followup` | `{ emailId }` | `{ reminderDate }` |

## 競合サービス分析

### 主要な競合サービス
- **WriteMail.ai**: メール自動生成・翻訳・トーン調整、Gmail連携
- **Lindy.ai**: Gmail/カレンダー/Slack連携、自動化、緊急度判定
- **EaseMate AI**: キーワード入力で内容生成・履歴管理
- **BeLikeNative**: 感情・トーン分析、穏やか・建設的な表現に自動改善
- **Crystal Knows**: 相手パーソナリティ分析・敬語推奨、LinkedIn連携

### 差別化ポイント
1. **業界特化型テンプレート**: 職種ごとの専門的なテンプレート提供
2. **社内文化学習**: 組織特有の表現や文化を学習する独自機能
3. **パーソナライズされたサジェスト**: ユーザーの職種や履歴に基づく高度なカスタマイゼーション

## プロジェクト構造

```
mail-AI-2025-10/
├── frontend/          # React.js フロントエンド
├── backend/           # Java Spring Boot バックエンド
├── database/          # データベーススキーマ・マイグレーション
├── docs/             # ドキュメント
└── README.md         # このファイル
```

## 開発開始手順

1. リポジトリのクローン
2. フロントエンドのセットアップ
3. バックエンドのセットアップ
4. データベースの初期化
5. 環境変数の設定
6. 開発サーバーの起動


