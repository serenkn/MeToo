# 技術スタック — MeToo

最終更新：2026-06-12
バージョン：2.1（Resend・Vitest追加）

-----

## 1. 採用スタック一覧

|カテゴリ   |採用                 |理由                                      |
|-------|-------------------|----------------------------------------|
|フレームワーク|Next.js（App Router）|開発者のスキルセット・フロント/バックを一体で管理できる            |
|言語     |TypeScript（strict） |型安全・下位AIモデル運用時のガードレール                   |
|スタイリング |Tailwind CSS       |開発速度                                    |
|認証     |NextAuth.js v5     |無料・Next.jsとの親和性が高い                      |
|DB     |Neon（PostgreSQL）   |無料枠が実用的・スケールゼロ・超過時は停止（勝手に課金されない）        |
|ORM    |Prisma             |スキーマ管理・型自動生成・マイグレーション                   |
|ストレージ  |Cloudflare R2      |egress無料・コスパ最良。DBにはURLのみ保存              |
|リアルタイム |Pusher（Sandbox）    |トークのリアルタイム配信。同時接続200・20万msg/日が無料        |
|地図     |**APIなし・リンク方式**    |住所＋Googleマップへのリンクのみ。キー不要・完全無料           |
|メール送信   |Resend             |パスワードリセットメール送信。無料枠3000通/月・API操作が簡潔      |
|テスト     |Vitest + RTL       |Vitestは高速・ESM対応。React Testing Libraryでコンポーネントテスト|
|ホスティング |Vercel（Hobby）      |Next.jsとの相性最良。商用化時にCloudflare Pages移行を検討|

-----

## 2. 各採用理由の詳細

### Next.js（App Router）

- フロントエンドとAPIを同一リポジトリで管理できる
- Server ComponentsでDB直接アクセスが可能
- Vercelとの親和性が最も高い

### Neon（PostgreSQL）

- 無料枠：ストレージ0.5GB/プロジェクト、月100 CU時間、転送5GB/月
- カード登録不要。超過時は停止するだけで勝手に課金されない
- スケールゼロでアクセスがない時間はコスト消費なし
- 注意：コールドスタート（0.5〜2秒）あり。プールURLとは別に`DIRECT_URL`（migrate用）が必要
- PlanetScaleは無料枠廃止のため除外。Supabaseは7日間不使用停止・無料枠500MBのため除外

### Prisma

- schema.prismaをDB定義の唯一の正とする
- マイグレーション・TypeScript型の自動生成
- Neonとの組み合わせ実績が多い

### NextAuth.js v5

- メール＋パスワード認証でスタート（Googleログインは将来対応）
- App Router対応・完全無料

### Cloudflare R2

- データ転送（egress）完全無料・ストレージ10GB/月無料
- ⚠️ 唯一の従量課金サービス（カード登録必須・超過で自動課金）→ 使用量通知を必ず設定
- アバター画像用。アップロード前にクライアント側で圧縮（長辺1080px・JPEG品質80%）

### Pusher

- トークのリアルタイム配信。LINEのような「送った瞬間に届く」体験を実現
- メッセージの永続化は別途Neonに保存（Pusherは配信のみ）
- 購読はトークルーム表示中のみ。画面を離れたらunsubscribe
- 無料枠超過後はStartup $49/月。それまでに収益化を間に合わせる

### 地図（リンク方式）

- 2025年3月のGoogle Maps API料金改定（$200クレジット廃止・地図表示は月1万回まで）により、埋め込み地図はMVP期最大の課金リスクだった
- 募集詳細では「住所表示＋Googleマップで開くリンク」のみとする
- リンク形式：`https://www.google.com/maps/search/?api=1&query={lat},{lng}`
- 収益化後に埋め込み地図へ戻すかを再検討

### Vercel

- Hobbyで開始。収益が出た段階でCloudflare Pages移行 or Vercel Pro（$20/月）を判断
- Cloudflare Workers（next-on-pages）は機能制限・情報量の少なさから初期採用を見送り

-----

### Resend

- パスワードリセットメールの送信に使用
- 無料枠：3000通/月（MVP期は十分）
- `RESEND_API_KEY`（秘密）・`EMAIL_FROM`（公開可）の2変数のみで動作

### Vitest + React Testing Library

- Jest互換API・ESMネイティブ対応・設定が軽量
- React Testing Libraryでコンポーネントのユニットテストを記述
- CI（GitHub Actions）で typecheck / lint / test を並行実行

-----

## 3. 採用しなかったもの

|候補                 |除外理由                                 |
|-------------------|-------------------------------------|
|Supabase           |7日間不使用で停止・無料枠500MB・スケール時コスト増大        |
|PlanetScale        |無料枠廃止済み（最低$39/月）                     |
|Firebase           |ベンダーロックイン・NoSQLはリレーション設計に不向き         |
|Cloudflare D1      |SQLiteベースで複雑なリレーションに不向き              |
|Google Maps API埋め込み|料金改定により課金リスク大。リンク方式で代替               |
|ポーリング/SSE          |Vercel HobbyのSSE10秒タイムアウト問題。Pusherで代替|

-----

## 4. ディレクトリ構造（Bulletproof思想）

```
metoo/
├── docs/                        ← 設計書一式（AIへの文脈共有を兼ねる）
├── prisma/
│   └── schema.prisma            ← DB定義の唯一の正
├── src/
│   ├── app/                     ← ルーティングのみ。薄く保つ
│   │   ├── api/                 ← Route Handlers
│   │   ├── (auth)/login, register
│   │   └── (main)/search, talk, profile
│   ├── features/                ← 機能単位で完結
│   │   ├── auth/
│   │   ├── recruitments/
│   │   ├── applications/
│   │   ├── groups/
│   │   ├── messages/            ← Pusher連携
│   │   ├── notifications/
│   │   └── profiles/
│   │       └── 各feature内：api/ components/ hooks/ types/ index.ts
│   ├── components/              ← 共通UI（Button, Tag, TabBar, Avatar等）
│   ├── lib/                     ← prisma.ts / auth.ts / r2.ts / pusher.ts
│   ├── config/
│   └── types/
└── CLAUDE.md                    ← Claude Code用の作業ルール
```

規律：

- feature間の直接import禁止（各featureのindex.ts経由のみ）。ESLintで機械的に強制
- app/はfeatureを組み立てるだけ。ロジックを書かない

-----

## 5. コスト

詳細は `docs/06_operations.md` を参照。

- MVP期：**月$0**（R2のみ従量課金リスクあり→通知設定で防御）
- 課金移行の目安：Neon CU時間の枯渇が2ヶ月続く / Pusher同時接続150超 / Vercel商用規模
- 移行時想定：月$75前後（Vercel Pro $20＋Neon Launch $5〜＋Pusher Startup $49）