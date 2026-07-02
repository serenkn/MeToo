# CLAUDE.md — MeToo 開発ルール

ランナー向けコミュニティマッチングアプリ「MeToo」のリポジトリ。
募集（さがす）→ 参加申請 → 承認 → グループトーク（はなす）が中核フロー。

## 最初にやること

**作業を始める前に必ず `docs/` を読むこと。** 設計の正は常にdocs/にある。

|ファイル                              |内容                   |
|----------------------------------|---------------------|
|docs/01_screen_design.md          |全13画面の仕様・遷移図・デザイントークン|
|docs/02_functional_requirements.md|機能要件とMVPスコープ         |
|docs/03_db_design.md              |テーブル定義・ER・インデックス     |
|docs/04_api_design.md             |全エンドポイントのI/F定義       |
|docs/05_tech_stack.md             |技術選定とディレクトリ構造        |
|docs/06_operations.md             |無料枠制約・コスト最適化ルール・環境変数 |

設計と実装がズレる変更をする場合は、**先にdocs/を更新してから**コードを書く。

## 技術スタック

Next.js (App Router) / TypeScript strict / Tailwind CSS / NextAuth.js v5 /
Neon (PostgreSQL) + Prisma / Cloudflare R2 / Pusher / Vercel

## コマンド

```bash
npm run dev          # 開発サーバー
npm run build        # ビルド
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest（単体テスト）
npx prisma migrate dev    # マイグレーション（DIRECT_URL必須）
npx prisma generate       # 型生成
```

## アーキテクチャ規律（Bulletproof）

- `src/features/` 配下に機能単位で完結させる（auth / recruitments / applications / groups / messages / notifications / profiles）
- **feature間の直接import禁止。** 他featureを使う場合は必ずその `index.ts` 経由
- `src/app/` はルーティングとfeatureの組み立てのみ。**ロジックを書かない**
- 横断UIは `src/components/`、外部サービスのクライアントは `src/lib/`（prisma.ts / auth.ts / r2.ts / pusher.ts）
- DB定義の唯一の正は `prisma/schema.prisma`。直接SQLでスキーマを変えない
- **認証はproxy（src/proxy.ts）に依存しない。** CVE-2025-29927 の教訓として proxy はUXリダイレクト専用。Route Handler・Server Componentは必ず `auth()` でセッションを独立検証する（`(main)/layout.tsx` がその参照実装）

## コスト制約（無料枠運用のため必ず守る）

1. 画像はアップロード前にクライアント側で圧縮（長辺1080px / JPEG品質80%）
1. 一覧・メッセージ取得は必ずページネーション（メッセージは50件ずつ）
1. 一覧系APIには短いキャッシュ（10〜30秒）を入れる
1. Pusherの購読はトークルーム表示中のみ。離脱時に必ずunsubscribe
1. DBにバイナリを保存しない。画像はR2、DBはURLのみ
1. 地図APIは使わない。住所＋Googleマップへのリンク（`https://www.google.com/maps/search/?api=1&query={lat},{lng}`）

## コーディング規約

- TypeScript strict。`any` 禁止（やむを得ない場合はコメントで理由を書く）
- UIは docs/01 のデザイントークンに従う（yellow #F5C518 / black #1A1A1A 等）
- APIレスポンスは docs/04 のI/F定義に厳密に従う。エラーは `{ error: string }` で統一
- 秘密情報を `NEXT_PUBLIC_` 付き環境変数に入れない
- コミットは小さく。1コミット1関心事

## 作業の進め方

- タスクは1機能ずつ。指示が大きい場合は分割を提案してから着手する
- **作業は必ず `claude/work` ブランチ上で行う。新しいブランチは作らない**（人間が明示的に指示した場合のみ例外）
- タスク開始前に必ず `develop` を pull し、`claude/work` を `develop` の最新に追従させる
- 完了したら `claude/work` から `develop` への PR を作成する。**マージは人間が行う**
- **`main` には push もマージもしない**
- コミットは小さく、こまめに push する
- 実装に迷ったらdocs/を根拠に判断し、docs/に書いていないことは推測せず確認を求める