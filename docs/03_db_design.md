# DB設計書 — MeToo

作成日：2026-05-13
バージョン：1.0
使用DB：Neon（PostgreSQL）

-----

## 1. テーブル一覧

|テーブル名        |説明                     |
|-------------|-----------------------|
|users        |ユーザー認証情報（NextAuth.js管理）|
|profiles     |プロフィール詳細               |
|recruitments |募集投稿                   |
|applications |参加申請                   |
|group_members|グループ参加メンバー             |
|messages     |トークメッセージ               |
|notifications|通知                     |
|favorites    |お気に入り                  |
|reports      |通報                     |

-----

## 2. テーブル定義

### users

NextAuth.jsが自動生成・管理するテーブル群。基本的に直接操作しない。

|カラム名          |型           |NULL    |説明         |
|--------------|------------|--------|-----------|
|id            |uuid        |NOT NULL|PK         |
|name          |varchar(255)|NULL    |表示名        |
|email         |varchar(255)|NOT NULL|メールアドレス    |
|email_verified|timestamp   |NULL    |メール認証日時    |
|image         |text        |NULL    |アバターURL（R2）|
|created_at    |timestamp   |NOT NULL|作成日時       |

-----

### profiles

|カラム名        |型           |NULL    |説明            |
|------------|------------|--------|--------------|
|id          |uuid        |NOT NULL|PK            |
|user_id     |uuid        |NOT NULL|FK → users.id |
|display_name|varchar(50) |NOT NULL|表示名           |
|age         |integer     |NULL    |年齢            |
|attribute   |varchar(50) |NULL    |属性（社会人ランナーなど） |
|pace        |varchar(20) |NULL    |ペース（例：5:20/km）|
|area        |varchar(100)|NULL    |活動エリア         |
|bio         |text        |NULL    |自己紹介          |
|avatar_url  |text        |NULL    |アバター画像URL（R2） |
|created_at  |timestamp   |NOT NULL|作成日時          |
|updated_at  |timestamp   |NOT NULL|更新日時          |

-----

### recruitments

|カラム名            |型            |NULL    |説明                       |
|----------------|-------------|--------|-------------------------|
|id              |uuid         |NOT NULL|PK                       |
|user_id         |uuid         |NOT NULL|FK → users.id（主催者）       |
|title           |varchar(100) |NOT NULL|タイトル                     |
|body            |text         |NOT NULL|本文                       |
|sport_type      |varchar(50)  |NOT NULL|スポーツ種別                   |
|pace            |varchar(20)  |NULL    |ペース                      |
|distance_km     |numeric(5,1) |NULL    |距離（km）                   |
|level           |varchar(20)  |NOT NULL|ビギナー/アマチュア/プロ/クラブ        |
|max_members     |integer      |NULL    |募集人数上限                   |
|meet_at         |timestamp    |NOT NULL|集合日時                     |
|location_name   |varchar(200) |NULL    |集合場所名称                   |
|location_address|varchar(200) |NULL    |集合場所住所                   |
|location_lat    |numeric(10,7)|NULL    |緯度                       |
|location_lng    |numeric(10,7)|NULL    |経度                       |
|course          |text         |NULL    |予定コース                    |
|notes           |text         |NULL    |荷物・その他                   |
|area            |varchar(100) |NULL    |エリア（検索用）                 |
|status          |varchar(20)  |NOT NULL|open / closed / cancelled|
|created_at      |timestamp    |NOT NULL|作成日時                     |
|updated_at      |timestamp    |NOT NULL|更新日時                     |

-----

### applications

|カラム名          |型          |NULL    |説明                           |
|--------------|-----------|--------|-----------------------------|
|id            |uuid       |NOT NULL|PK                           |
|recruitment_id|uuid       |NOT NULL|FK → recruitments.id         |
|applicant_id  |uuid       |NOT NULL|FK → users.id（申請者）           |
|message       |text       |NULL    |申請メッセージ（200文字以内）             |
|status        |varchar(20)|NOT NULL|pending / approved / rejected|
|created_at    |timestamp  |NOT NULL|申請日時                         |
|updated_at    |timestamp  |NOT NULL|更新日時                         |

-----

### group_members

applicationsのstatusがapprovedになった時点で自動生成する想定。

|カラム名          |型        |NULL    |説明                  |
|--------------|---------|--------|--------------------|
|id            |uuid     |NOT NULL|PK                  |
|recruitment_id|uuid     |NOT NULL|FK → recruitments.id|
|user_id       |uuid     |NOT NULL|FK → users.id       |
|is_host       |boolean  |NOT NULL|主催者フラグ              |
|joined_at     |timestamp|NOT NULL|参加日時                |

-----

### messages

|カラム名          |型        |NULL    |説明                          |
|--------------|---------|--------|----------------------------|
|id            |uuid     |NOT NULL|PK                          |
|recruitment_id|uuid     |NOT NULL|FK → recruitments.id（グループ識別）|
|sender_id     |uuid     |NOT NULL|FK → users.id               |
|body          |text     |NOT NULL|メッセージ本文                     |
|created_at    |timestamp|NOT NULL|送信日時                        |

-----

### notifications

|カラム名      |型          |NULL    |説明                                                       |
|----------|-----------|--------|---------------------------------------------------------|
|id        |uuid       |NOT NULL|PK                                                       |
|user_id   |uuid       |NOT NULL|FK → users.id（通知先）                                       |
|type      |varchar(50)|NOT NULL|application_received / application_approved / new_message|
|related_id|uuid       |NULL    |関連するID（申請IDなど）                                           |
|is_read   |boolean    |NOT NULL|既読フラグ                                                    |
|created_at|timestamp  |NOT NULL|作成日時                                                     |

-----

### favorites

|カラム名          |型        |NULL    |説明                  |
|--------------|---------|--------|--------------------|
|id            |uuid     |NOT NULL|PK                  |
|user_id       |uuid     |NOT NULL|FK → users.id       |
|recruitment_id|uuid     |NOT NULL|FK → recruitments.id|
|created_at    |timestamp|NOT NULL|登録日時                |

UNIQUE制約：(user_id, recruitment_id)

-----

### reports

|カラム名            |型        |NULL    |説明                 |
|----------------|---------|--------|-------------------|
|id              |uuid     |NOT NULL|PK                 |
|reporter_id     |uuid     |NOT NULL|FK → users.id（通報者） |
|reported_user_id|uuid     |NOT NULL|FK → users.id（通報対象）|
|reason          |text     |NOT NULL|通報理由               |
|created_at      |timestamp|NOT NULL|通報日時               |

-----

## 3. ER図（テキスト表現）

```
users
  ├── profiles (1:1)
  ├── recruitments (1:N) ← 主催者として
  ├── applications (1:N) ← 申請者として
  ├── group_members (1:N)
  ├── messages (1:N)
  ├── notifications (1:N)
  ├── favorites (1:N)
  └── reports (1:N)

recruitments
  ├── applications (1:N)
  ├── group_members (1:N)
  ├── messages (1:N)
  └── favorites (1:N)

applications
  └── group_members (申請承認 → 自動生成)
```

-----

## 4. インデックス方針

|テーブル         |カラム                       |理由         |
|-------------|--------------------------|-----------|
|recruitments |meet_at                   |日付フィルター    |
|recruitments |area                      |エリアフィルター   |
|recruitments |level                     |レベルフィルター   |
|recruitments |status                    |open絞り込み   |
|applications |recruitment_id            |募集ごとの申請一覧  |
|applications |applicant_id              |ユーザーごとの申請履歴|
|group_members|recruitment_id            |グループメンバー取得 |
|messages     |recruitment_id, created_at|トーク履歴取得    |
|notifications|user_id, is_read          |未読通知取得     |

-----

*次ドキュメント：04_api_design.md*