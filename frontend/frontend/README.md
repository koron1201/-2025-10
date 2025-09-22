# Frontend (React + TypeScript + Vite)

## セットアップ

1. 依存インストール

```bash
npm install
```

2. 開発サーバ起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

デフォルトではモックAPIで動作します（バックエンド不要）。本物のバックエンドに接続する場合は以下を参照してください。

### モック/実APIの切替

- モック有効: `.env` に `VITE_USE_MOCK=true`
- 実API利用: `.env` から `VITE_USE_MOCK` を削除、または `false` に設定

実APIを使う場合、`vite.config.ts` の開発プロキシにより `/api` は `http://localhost:8080` に転送されます。

## ビルド

```bash
npm run build
```

## プロジェクト構成（抜粋）

```
src/
  lib/apiClient.ts      # API呼び出し関数
  types/api.ts          # APIの型定義
  App.tsx               # MVP UI（キーワード入力→生成→保存）
vite.config.ts          # 開発プロキシ設定（/api → :8080）
```
