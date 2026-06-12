# MeToo

ランナーの「私も」を叶える、スポーツコミュニティマッチングアプリ。

走りたい場所・日時・ペースで仲間を募集し、参加申請 → 承認 → グループトークで合流するまでをひとつのアプリで完結させる。

## 中核フロー

```
募集を探す（さがす） → 参加申請 → 主催者が承認 → グループトーク（はなす） → 一緒に走る
```

## 技術スタック

|カテゴリ   |採用                                      |
|-------|----------------------------------------|
|フレームワーク|Next.js (App Router) / TypeScript strict|
|スタイリング |Tailwind CSS                            |
|認証     |NextAuth.js v5                          |
|DB     |Neon (PostgreSQL) + Prisma              |
|画像ストレージ|Cloudflare R2                           |
|リアルタイム |Pusher                                  |
|ホスティング |Vercel                                  |

選定理由・無料枠の制約は <docs/05_tech_stack.md> と <docs/06_operations.md> を参照。

## ドキュメント

設計の正は `docs/` にある。**実装・修正の前に必ず読むこと。**

|ファイル                                |内容                 |
|------------------------------------|-------------------|
|<docs/01_screen_design.md>          |全13画面の仕様・遷移図       |
|<docs/02_functional_requirements.md>|機能要件・MVPスコープ       |
|<docs/03_db_design.md>              |DB設計（9テーブル）        |
|<docs/04_api_design.md>             |API設計              |
|<docs/05_tech_stack.md>             |技術選定・ディレクトリ構造      |
|<docs/06_operations.md>             |無料枠運用・コスト最適化・AI開発体制|
|docs/metoo-ui-v2.jsx                |UI設計図（全13画面モック）    |

AI（Claude Code）での開発ルールはリポジトリ直下の <CLAUDE.md> を参照。

## ローカル開発

```bash
# 依存インストール
npm install

# 環境変数を設定（.env.example をコピーして値を埋める）
cp .env.example .env.local

# DBマイグレーション
npx prisma migrate dev

# 開発サーバー起動
npm run dev
```

環境変数の一覧と取得先は <docs/06_operations.md> を参照。

## デプロイ

- `main` ブランチへのマージで Vercel が自動デプロイ
- `main` は保護ブランチ。マージ判断は人間のみが行う

## アーキテクチャ規律

Bulletproof 思想を採用。`src/features/` 配下に機能単位で完結させ、feature 間の直接 import は禁止（各 feature の `index.ts` 経由のみ）。詳細は <CLAUDE.md>。