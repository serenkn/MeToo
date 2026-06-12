# API設計書 — MeToo

作成日：2026-05-13
バージョン：1.0
ベースURL：/api

-----

## 方針

- Next.js App RouterのRoute Handlers（/app/api/…）で実装
- 認証はNextAuth.jsのセッションで管理
- レスポンスはすべてJSON
- エラーレスポンスは { error: string } の形式で統一

-----

## 1. 認証

|メソッド|パス                   |説明                       |
|----|---------------------|-------------------------|
|POST|/api/auth/register   |新規登録                     |
|POST|/api/auth/[…nextauth]|NextAuth.jsのエンドポイント（自動生成）|

### POST /api/auth/register

`users` と `profiles` をトランザクションで同時作成する（docs/03 §5参照）。

**リクエスト**

```json
{
  "email": "string",
  "password": "string",
  "display_name": "string"
}
```

**レスポンス 201**

```json
{
  "id": "uuid",
  "email": "string"
}
```

### POST /api/auth/forgot-password

パスワードリセット用のメールをResendで送信する。

**リクエスト**

```json
{
  "email": "string"
}
```

**レスポンス 200**（メールアドレスの存否にかかわらず常に200を返す）

```json
{
  "message": "メールを送信しました"
}
```

### POST /api/auth/reset-password

リセットトークンを検証してパスワードを更新する。

**リクエスト**

```json
{
  "token": "string",
  "password": "string"
}
```

**レスポンス 200**

```json
{
  "message": "パスワードを更新しました"
}
```

**エラー**

- 400：トークンが無効または期限切れ

-----

## 2. プロフィール

|メソッド|パス                    |説明            |認証|
|----|----------------------|--------------|--|
|GET |/api/profiles/me      |自分のプロフィール取得   |必須|
|PUT |/api/profiles/me      |プロフィール更新      |必須|
|GET |/api/profiles/[userId]|他ユーザーのプロフィール取得|必須|

### GET /api/profiles/me

**レスポンス 200**

```json
{
  "id": "uuid",
  "display_name": "string",
  "age": 24,
  "attribute": "社会人ランナー",
  "pace": "5:20/km",
  "area": "大阪",
  "bio": "string",
  "avatar_url": "string"
}
```

### PUT /api/profiles/me

**リクエスト**

```json
{
  "display_name": "string",
  "age": 24,
  "attribute": "string",
  "pace": "string",
  "area": "string",
  "bio": "string",
  "avatar_url": "string"
}
```

-----

## 3. 募集

|メソッド  |パス                    |説明             |認証       |
|------|----------------------|---------------|---------|
|GET   |/api/recruitments     |募集一覧取得（フィルター対応）|必須       |
|POST  |/api/recruitments     |募集作成           |必須       |
|GET   |/api/recruitments/[id]|募集詳細取得         |必須       |
|PUT   |/api/recruitments/[id]|募集編集           |必須（主催者のみ）|
|DELETE|/api/recruitments/[id]|募集削除           |必須（主催者のみ）|

### GET /api/recruitments

**クエリパラメータ**

```
area         : string   // エリア絞り込み
distance_min : number   // 距離下限
distance_max : number   // 距離上限
pace         : string   // ペース
max_members  : number   // 募集人数
level        : string   // beginner / amateur / pro / club
date         : string   // today / this_week / this_month（省略時=いつでも・絞り込みなし）
sort         : string   // new（デフォルト）/ meet_at
page         : number   // ページ番号（デフォルト1）
limit        : number   // 件数（デフォルト20）
```

**レスポンス 200**

```json
{
  "total": 128,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "body": "string",
      "pace": "string",
      "distance_km": 10,
      "level": "string",
      "max_members": 10,
      "meet_at": "2026-05-14T19:00:00Z",
      "area": "大阪",
      "status": "open",
      "host": {
        "id": "uuid",
        "display_name": "string",
        "age": 24,
        "attribute": "string",
        "avatar_url": "string"
      },
      "member_count": 3,
      "is_favorite": false
    }
  ]
}
```

### POST /api/recruitments

**リクエスト**

```json
{
  "title": "string",
  "body": "string",
  "sport_type": "string",
  "pace": "string",
  "distance_km": 10,
  "level": "string",
  "max_members": 10,
  "meet_at": "2026-05-14T19:00:00Z",
  "location_name": "string",
  "location_address": "string",
  "location_lat": 34.123456,
  "location_lng": 135.123456,
  "course": "string",
  "notes": "string",
  "area": "string"
}
```

-----

## 4. 参加申請

|メソッド|パス                                 |説明          |認証       |
|----|-----------------------------------|------------|---------|
|POST|/api/recruitments/[id]/apply       |参加申請        |必須       |
|GET |/api/recruitments/[id]/applications|申請一覧取得（主催者用）|必須       |
|PUT |/api/applications/[applicationId]  |申請の承認・拒否    |必須（主催者のみ）|

### POST /api/recruitments/[id]/apply

**リクエスト**

```json
{
  "message": "string（200文字以内、任意）"
}
```

**レスポンス 201**

```json
{
  "id": "uuid",
  "status": "pending"
}
```

### PUT /api/applications/[applicationId]

**リクエスト**

```json
{
  "status": "approved | rejected"
}
```

-----

## 5. グループ

|メソッド|パス                         |説明             |認証|
|----|---------------------------|---------------|--|
|GET |/api/groups                |自分が参加しているグループ一覧|必須|
|GET |/api/groups/[recruitmentId]|グループ詳細（メンバー一覧） |必須|

### GET /api/groups/[recruitmentId]

**レスポンス 200**

```json
{
  "recruitment": {
    "id": "uuid",
    "title": "string",
    "pace": "string",
    "max_members": 10,
    "meet_at": "2026-05-14T19:00:00Z"
  },
  "members": [
    {
      "user_id": "uuid",
      "display_name": "string",
      "age": 24,
      "avatar_url": "string",
      "is_host": true
    }
  ]
}
```

-----

## 6. メッセージ（トーク）

|メソッド|パス                                  |説明       |認証|
|----|------------------------------------|---------|--|
|GET |/api/groups/[recruitmentId]/messages|メッセージ一覧取得|必須|
|POST|/api/groups/[recruitmentId]/messages|メッセージ送信  |必須|

### GET /api/groups/[recruitmentId]/messages

**クエリパラメータ**

```
before     : string   // このIDより古いメッセージを取得（ページネーション）
limit      : number   // 件数（デフォルト50）
```

**レスポンス 200**

```json
{
  "data": [
    {
      "id": "uuid",
      "sender": {
        "id": "uuid",
        "display_name": "string",
        "avatar_url": "string"
      },
      "body": "string",
      "created_at": "2026-05-14T19:00:00Z"
    }
  ]
}
```

### POST /api/groups/[recruitmentId]/messages

**リクエスト**

```json
{
  "body": "string"
}
```

**処理順序（リアルタイム配信）**

1. Neonのmessagesテーブルに保存
1. 保存成功後、Pusherのチャンネル `group-{recruitmentId}` にイベント `new-message` をpublish
1. クライアント（トークルーム表示中のみ購読）が受信して画面に即時反映

-----

## 7. 通知

|メソッド|パス                          |説明    |認証|
|----|----------------------------|------|--|
|GET |/api/notifications          |通知一覧取得|必須|
|PUT |/api/notifications/[id]/read|既読にする |必須|
|PUT |/api/notifications/read-all |全件既読  |必須|

-----

## 8. お気に入り

|メソッド  |パス                            |説明     |認証|
|------|------------------------------|-------|--|
|POST  |/api/favorites                |お気に入り登録|必須|
|DELETE|/api/favorites/[recruitmentId]|お気に入り解除|必須|
|GET   |/api/favorites                |お気に入り一覧|必須|

-----

## 9. 画像アップロード

|メソッド|パス                |説明              |認証|
|----|------------------|----------------|--|
|POST|/api/upload/avatar|アバター画像をR2にアップロード|必須|

### POST /api/upload/avatar

- multipart/form-dataでファイル受け取り
- R2にアップロード後、URLを返す

**レスポンス 200**

```json
{
  "url": "https://r2.example.com/avatars/uuid.jpg"
}
```

-----

## 10. 通報

|メソッド|パス          |説明     |認証|
|----|------------|-------|--|
|POST|/api/reports|ユーザーを通報|必須|

-----

## 11. エラーコード一覧

|ステータス|意味        |例             |
|-----|----------|--------------|
|400  |バリデーションエラー|必須項目が未入力      |
|401  |未認証       |セッションなし       |
|403  |権限なし      |他人の募集を編集しようとした|
|404  |見つからない    |存在しない募集ID     |
|409  |競合        |すでに申請済み       |
|500  |サーバーエラー   |DB接続失敗など      |

-----

*次ドキュメント：05_tech_stack.md*