import { useState } from "react";

// ───────── Design Tokens（画像準拠） ─────────
const YELLOW = "#F5C518";
const YELLOW_SOFT = "#FFF9E3";
const BLACK = "#1A1A1A";
const WHITE = "#FFFFFF";
const BG = "#F7F7F7";
const TAG_BG = "#EFEFEF";
const BORDER = "#E6E6E6";
const TEXT = "#222222";
const MUTED = "#999999";

// ───────── 共通パーツ ─────────

// 椋鳥マスコット（CSS再現・本番はロゴ画像に差し替え）
const Bird = ({ size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    backgroundColor: "#D9D9D9",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", flexShrink: 0,
  }}>
    <div style={{
      width: size * 0.78, height: size * 0.78, borderRadius: "50%",
      backgroundColor: WHITE, display: "flex", alignItems: "center",
      justifyContent: "center", gap: size * 0.1,
    }}>
      <div style={{ width: size * 0.16, height: size * 0.16, borderRadius: "50%", backgroundColor: BLACK }} />
      <div style={{
        width: 0, height: 0, position: "absolute", bottom: size * 0.18,
        borderLeft: `${size * 0.08}px solid transparent`,
        borderRight: `${size * 0.08}px solid transparent`,
        borderTop: `${size * 0.1}px solid ${BLACK}`,
      }} />
      <div style={{ width: size * 0.16, height: size * 0.16, borderRadius: "50%", backgroundColor: BLACK }} />
    </div>
  </div>
);

const Avatar = ({ ch = "リ", size = 36, host = false }) => (
  <div style={{ position: "relative", flexShrink: 0 }}>
    <div style={{
      width: size, height: size, borderRadius: "50%", backgroundColor: "#D9D9D9",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, color: "#666", fontWeight: 600,
    }}>{ch}</div>
    {host && (
      <div style={{
        position: "absolute", bottom: -1, right: -1, width: size * 0.4, height: size * 0.4,
        borderRadius: "50%", backgroundColor: YELLOW, fontSize: size * 0.22,
        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
      }}>主</div>
    )}
  </div>
);

const Tag = ({ children, yellow = false }) => (
  <span style={{
    padding: "2px 8px", borderRadius: 20, fontSize: 8,
    backgroundColor: yellow ? YELLOW : TAG_BG,
    color: yellow ? BLACK : "#555", fontWeight: 500, whiteSpace: "nowrap",
  }}>{children}</span>
);

const Btn = ({ children, primary = true, style = {} }) => (
  <div style={{
    width: "100%", padding: "9px 0", borderRadius: 10, textAlign: "center",
    backgroundColor: primary ? YELLOW : WHITE,
    border: primary ? "none" : `1.5px solid ${BORDER}`,
    fontSize: 11, fontWeight: 700, color: BLACK, boxSizing: "border-box", ...style,
  }}>{children}</div>
);

const TabBar = ({ active }) => (
  <div style={{
    display: "flex", alignItems: "center", borderTop: `1.5px solid ${BORDER}`,
    padding: "6px 10px 5px", backgroundColor: WHITE, gap: 4,
  }}>
    <div style={{
      width: 22, height: 22, borderRadius: "50%", backgroundColor: BLACK,
      color: WHITE, fontSize: 10, display: "flex", alignItems: "center",
      justifyContent: "center", fontWeight: 700, flexShrink: 0,
    }}>N</div>
    {[["💬", "はなす"], ["🔍", "さがす"], ["👤", "プロフィール"]].map(([icon, label], i) => (
      <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <div style={{
          fontSize: 12, padding: "2px 12px", borderRadius: 14,
          backgroundColor: active === i ? YELLOW : "transparent",
        }}>{icon}</div>
        <div style={{ fontSize: 7, color: active === i ? BLACK : MUTED, fontWeight: active === i ? 700 : 400 }}>{label}</div>
      </div>
    ))}
  </div>
);

const Head = ({ title, back = true }) => (
  <div style={{
    display: "flex", alignItems: "center", padding: "8px 12px",
    borderBottom: `1px solid ${BORDER}`, backgroundColor: WHITE, gap: 8,
  }}>
    {back && <div style={{ fontSize: 11, color: TEXT }}>〈 戻る</div>}
    <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, flex: 1, textAlign: back ? "center" : "left", marginRight: back ? 38 : 0 }}>{title}</div>
  </div>
);

const AppHead = () => (
  <div style={{
    display: "flex", alignItems: "center", padding: "8px 12px",
    backgroundColor: WHITE, borderBottom: `1px solid ${BORDER}`, gap: 6,
  }}>
    <div style={{
      width: 20, height: 20, borderRadius: "50%", backgroundColor: BLACK, color: WHITE,
      fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
    }}>MT</div>
    <div style={{ fontSize: 12, fontWeight: 800, color: TEXT }}>MeToo</div>
    <div style={{ flex: 1 }} />
    <div style={{ fontSize: 11 }}>🔍</div>
    <div style={{
      width: 20, height: 20, borderRadius: "50%", backgroundColor: YELLOW,
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
    }}>+</div>
    <div style={{
      width: 20, height: 20, borderRadius: "50%", backgroundColor: BLACK, color: WHITE,
      fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
    }}>ME</div>
  </div>
);

// ───────── 募集カード ─────────
const RecruitCard = ({ name, meta, title, body, tags, highlight = false }) => (
  <div style={{
    backgroundColor: highlight ? YELLOW_SOFT : WHITE,
    border: highlight ? `1.5px solid ${YELLOW}` : `1px solid ${BORDER}`,
    borderRadius: 12, padding: "10px 10px",
    display: "flex", gap: 8,
  }}>
    <Avatar ch={name} size={34} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 8, color: MUTED }}>{meta}</div>
        <div style={{ fontSize: 10, color: "#CCC" }}>☆</div>
      </div>
      {title && <div style={{ fontSize: 10, fontWeight: 700, color: TEXT, margin: "2px 0" }}>{title}</div>}
      {body && <div style={{ fontSize: 8, color: "#777", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{body}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 5 }}>
        {tags.map(t => <Tag key={t}>{t}</Tag>)}
      </div>
    </div>
  </div>
);

// ───────── S01 スプラッシュ ─────────
const S01 = () => (
  <div style={{
    height: "100%", backgroundColor: BLACK, display: "flex",
    flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
  }}>
    <Bird size={56} />
    <div style={{ color: WHITE, fontSize: 24, fontWeight: 800, letterSpacing: "0.02em" }}>
      MeT<span style={{ color: YELLOW }}>oo</span>
    </div>
    <div style={{ color: "#888", fontSize: 8 }}>スポーツのコミュニティを広げるアプリケーション</div>
  </div>
);

// ───────── S02 ログイン ─────────
const S02 = () => (
  <div style={{ height: "100%", backgroundColor: WHITE, padding: "28px 18px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 8 }}>
      <Bird size={44} />
      <div style={{ fontSize: 18, fontWeight: 800 }}>おかえりなさい</div>
    </div>
    <div style={{ fontSize: 9, fontWeight: 600 }}>メールアドレス</div>
    <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "8px 10px", fontSize: 9, color: MUTED }}>example@mail.com</div>
    <div style={{ fontSize: 9, fontWeight: 600 }}>パスワード</div>
    <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "8px 10px", fontSize: 9, color: MUTED }}>••••••••</div>
    <div style={{ fontSize: 8, color: MUTED, textAlign: "right" }}>パスワードを忘れた方</div>
    <Btn>ログイン</Btn>
    <div style={{ textAlign: "center", fontSize: 9, color: MUTED, marginTop: "auto" }}>
      アカウントをお持ちでない方は <span style={{ color: BLACK, fontWeight: 700, textDecoration: "underline" }}>新規登録</span>
    </div>
  </div>
);

// ───────── S03 新規登録 ─────────
const S03 = () => (
  <div style={{ height: "100%", backgroundColor: WHITE, display: "flex", flexDirection: "column" }}>
    <Head title="新規登録" />
    <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
      {[["ニックネーム", "リョースケ"], ["メールアドレス", "example@mail.com"], ["パスワード", "8文字以上"], ["パスワード（確認）", ""]].map(([l, p]) => (
        <div key={l}>
          <div style={{ fontSize: 9, fontWeight: 600, marginBottom: 3 }}>{l}</div>
          <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "8px 10px", fontSize: 9, color: MUTED, minHeight: 12 }}>{p}</div>
        </div>
      ))}
      <div style={{ fontSize: 8, color: MUTED, lineHeight: 1.6 }}>
        登録することで<span style={{ textDecoration: "underline" }}>利用規約</span>と<span style={{ textDecoration: "underline" }}>プライバシーポリシー</span>に同意したものとみなされます
      </div>
    </div>
    <div style={{ padding: "0 18px 16px" }}><Btn>登録する</Btn></div>
  </div>
);

// ───────── S04 募集一覧（さがす） ─────────
const S04 = () => (
  <div style={{ height: "100%", backgroundColor: BG, display: "flex", flexDirection: "column" }}>
    <AppHead />
    <div style={{ flex: 1, overflow: "hidden", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 800 }}>ランナーを探す</div>
        <div style={{ fontSize: 8, color: MUTED }}>一緒に走る仲間を見つけよう！</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ fontSize: 8, color: MUTED, flex: 1 }}>128件の募集</div>
        <div style={{ fontSize: 8, border: `1px solid ${BORDER}`, backgroundColor: WHITE, borderRadius: 6, padding: "3px 8px" }}>▽ 絞り込み</div>
        <div style={{ fontSize: 8, border: `1px solid ${BORDER}`, backgroundColor: WHITE, borderRadius: 6, padding: "3px 8px" }}>新着順</div>
      </div>
      <RecruitCard
        name="リ" meta="リョースケ 24歳・社会人ランナー"
        title="山田池公園で10kmジョグしましょう！"
        body="5月14日(月)の19時〜山田池公園集合で10kmのジョグをします！ペースは4:20/kmで頑張..."
        tags={["4:20/km", "4〜10人", "10km", "5月14日(月) 19:00〜", "大阪"]}
      />
      <RecruitCard
        name="t" meta="takumi 26歳・社会人ランナー"
        title="長居公園でワイワイ走りませんか〜"
        body="5月19日(土)の13時〜長居公園で8kmほど、みんなでワイワイ話しながら走りませんか〜..."
        tags={["5:30/km", "10〜15人", "8km", "5月19日(土) 13:00〜", "大阪"]}
      />
    </div>
    <TabBar active={1} />
  </div>
);

// ───────── S05 検索フィルター ─────────
const S05 = () => (
  <div style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 12, boxSizing: "border-box" }}>
    <div style={{ backgroundColor: WHITE, borderRadius: 14, padding: "12px 14px", width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800 }}>検索条件</div>
        <div style={{ fontSize: 9, color: MUTED }}>⟳ リセット　✕</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {[["◎ エリア", "すべてのエリア"], ["⛳ 距離", "すべての距離"], ["🏃 ペース", "すべてのペース"], ["👥 参加人数", "すべての人数"]].map(([l, v]) => (
          <div key={l}>
            <div style={{ fontSize: 8, color: "#555", marginBottom: 2 }}>{l}</div>
            <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "6px 8px", fontSize: 8, display: "flex", justifyContent: "space-between" }}>{v}<span>▾</span></div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 8, color: "#555", marginBottom: 3 }}>📶 レベル</div>
        {["初心者歓迎", "中級者向け", "上級者向け"].map(l => (
          <div key={l} style={{ display: "flex", gap: 5, alignItems: "center", fontSize: 9, marginBottom: 3 }}>
            <div style={{ width: 10, height: 10, border: `1.5px solid ${BORDER}`, borderRadius: 2 }} />{l}
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 8, color: "#555", marginBottom: 2 }}>📅 日付</div>
        <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "6px 8px", fontSize: 8, display: "flex", justifyContent: "space-between" }}>いつでも<span>▾</span></div>
      </div>
      <Btn>検索する</Btn>
    </div>
  </div>
);

// ───────── S06 募集詳細 ─────────
const S06 = () => (
  <div style={{ height: "100%", backgroundColor: WHITE, display: "flex", flexDirection: "column" }}>
    <Head title="" />
    <div style={{ flex: 1, overflow: "hidden", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Avatar ch="リ" size={36} />
        <div style={{ fontSize: 9, color: "#555", flex: 1 }}>リョースケ 24歳・社会人ランナー</div>
        <div style={{ fontSize: 12, color: YELLOW }}>★</div>
        <div style={{ fontSize: 10, color: MUTED }}>…</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 800 }}>山田池公園で10kmジョグしましょう！</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {["4:20/km", "4〜10人", "10km", "5月14日(月) 19:00〜", "大阪"].map(t => <Tag key={t}>{t}</Tag>)}
      </div>
      <div style={{ fontSize: 9, color: "#555", lineHeight: 1.7 }}>
        5月14日(月)の19時〜山田池公園集合で10kmのジョグをします！ペースは4:20/kmで頑張りましょう！！提案あれば待ってます d(^_^o)
      </div>
      <div style={{ fontSize: 9 }}>
        <div style={{ fontWeight: 700, marginBottom: 2 }}>◎ 集合場所</div>
        <div style={{ color: "#555" }}>山田池公園 南駐車場</div>
        <div style={{ fontSize: 8, color: MUTED }}>大阪府枚方市山田池公園1-1</div>
      </div>
      <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "7px 10px", display: "flex", alignItems: "center", gap: 6, fontSize: 9, fontWeight: 700 }}>
        <span>📍</span><span>Googleマップで開く</span><span style={{ marginLeft: "auto", color: MUTED }}>↗</span>
      </div>
      <div style={{ fontSize: 9 }}>
        <div style={{ fontWeight: 700 }}>🗺 予定コース</div>
        <div style={{ color: "#555" }}>山田池公園 外周コース（1周 2.5km）×4周</div>
      </div>
    </div>
    <div style={{ padding: "0 14px 12px" }}><Btn>参加申請する</Btn></div>
    <TabBar active={1} />
  </div>
);

// ───────── S07 募集作成 ─────────
const S07 = () => (
  <div style={{ height: "100%", backgroundColor: WHITE, display: "flex", flexDirection: "column" }}>
    <Head title="募集を作成" />
    <div style={{ flex: 1, overflow: "hidden", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
      {[
        ["タイトル", "山田池公園で10kmジョグしましょう！"],
        ["日時", "2026/05/14 19:00"],
        ["集合場所", "山田池公園 南駐車場（地図で選択）"],
        ["距離", "10km"],
        ["ペース", "4:20/km"],
        ["レベル", "アマチュア ▾"],
        ["募集人数", "4〜10人 ▾"],
      ].map(([l, v]) => (
        <div key={l}>
          <div style={{ fontSize: 8, fontWeight: 600, marginBottom: 2 }}>{l}</div>
          <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "6px 8px", fontSize: 8, color: "#555" }}>{v}</div>
        </div>
      ))}
      <div>
        <div style={{ fontSize: 8, fontWeight: 600, marginBottom: 2 }}>本文</div>
        <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "6px 8px", fontSize: 8, color: MUTED, height: 30 }}>一言メッセージ…</div>
      </div>
    </div>
    <div style={{ padding: "0 14px 12px" }}><Btn>募集を投稿する</Btn></div>
  </div>
);

// ───────── S08 参加申請 ─────────
const S08 = () => (
  <div style={{ height: "100%", backgroundColor: WHITE, display: "flex", flexDirection: "column" }}>
    <Head title="参加申請" />
    <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Avatar ch="リ" size={36} />
        <div style={{ fontSize: 9, color: "#555" }}>リョースケ 24歳・社会人ランナー</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {["4:20/km", "4〜10人", "10km", "5月14日(月) 19:00〜", "大阪"].map(t => <Tag key={t}>{t}</Tag>)}
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4 }}>メッセージ（任意）</div>
      <div style={{ border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "8px 10px", fontSize: 9, color: TEXT, height: 70, lineHeight: 1.6 }}>
        はじめまして！参加希望です！<br />よろしくお願いします！
      </div>
      <div style={{ fontSize: 8, color: MUTED, textAlign: "right" }}>26文字以内/200文字以内</div>
    </div>
    <div style={{ padding: "0 14px 12px" }}><Btn>申請する</Btn></div>
    <TabBar active={1} />
  </div>
);

// ───────── S09 参加したグループ ─────────
const S09 = () => (
  <div style={{ height: "100%", backgroundColor: WHITE, display: "flex", flexDirection: "column" }}>
    <Head title="参加したグループ" />
    <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      <RecruitCard
        name="リ" meta="リョースケ 24歳・社会人ランナー"
        title="" body=""
        tags={["4:20/km", "4〜10人", "10km", "5月14日(月) 19:00〜"]}
        highlight
      />
      <div style={{ fontSize: 10, fontWeight: 700 }}>参加メンバー</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {[["リ", "リョースケ", "24歳", true], ["t", "takumi", "26歳", false], ["あ", "あっき〜", "30歳", false], ["そ", "そうた", "28歳", false], ["や", "やまちゃん", "36歳", false]].map(([ch, name, age, host]) => (
          <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Avatar ch={ch} size={34} host={host} />
            <div style={{ fontSize: 7, fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 7, color: MUTED }}>{age}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ padding: "0 14px 12px" }}><Btn primary={false}>トークする</Btn></div>
    <TabBar active={1} />
  </div>
);

// ───────── S10 トーク一覧（はなす） ─────────
const S10 = () => (
  <div style={{ height: "100%", backgroundColor: WHITE, display: "flex", flexDirection: "column" }}>
    <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ fontSize: 15, fontWeight: 800 }}>はなす</div>
    </div>
    <div style={{ flex: 1, overflow: "hidden" }}>
      {[
        ["山田池公園 10kmジョグ", "リョースケ: 明日よろしくお願いします！", "21:40", 2],
        ["長居公園 ワイワイラン", "takumi: お疲れ様でした〜", "昨日", 0],
        ["枚方陸上競技場 3000m走", "あっき〜: 来週も開催します！", "5/20", 0],
      ].map(([title, msg, time, unread]) => (
        <div key={title} style={{ display: "flex", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, alignItems: "center" }}>
          <Bird size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700 }}>{title}</div>
            <div style={{ fontSize: 8, color: MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msg}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
            <div style={{ fontSize: 7, color: MUTED }}>{time}</div>
            {unread > 0 && (
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: YELLOW, fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</div>
            )}
          </div>
        </div>
      ))}
    </div>
    <TabBar active={0} />
  </div>
);

// ───────── S11 トークルーム ─────────
const S11 = () => (
  <div style={{ height: "100%", backgroundColor: BG, display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", backgroundColor: WHITE, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ fontSize: 11 }}>〈</div>
      <Bird size={26} />
      <div>
        <div style={{ fontSize: 10, fontWeight: 700 }}>山田池公園 10kmジョグ</div>
        <div style={{ fontSize: 7, color: MUTED }}>5人のメンバー</div>
      </div>
    </div>
    <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
        <Avatar ch="t" size={22} />
        <div>
          <div style={{ fontSize: 7, color: MUTED, marginBottom: 1 }}>takumi</div>
          <div style={{ backgroundColor: WHITE, borderRadius: "10px 10px 10px 2px", padding: "6px 9px", fontSize: 9, border: `1px solid ${BORDER}` }}>明日の集合場所って南駐車場であってますか？</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ backgroundColor: YELLOW, borderRadius: "10px 10px 2px 10px", padding: "6px 9px", fontSize: 9, maxWidth: "70%" }}>あってます！19時に南駐車場集合でお願いします🏃</div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
        <Avatar ch="あ" size={22} />
        <div>
          <div style={{ fontSize: 7, color: MUTED, marginBottom: 1 }}>あっき〜</div>
          <div style={{ backgroundColor: WHITE, borderRadius: "10px 10px 10px 2px", padding: "6px 9px", fontSize: 9, border: `1px solid ${BORDER}` }}>了解です！楽しみにしてます</div>
        </div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 6, padding: "8px 12px", backgroundColor: WHITE, borderTop: `1px solid ${BORDER}`, alignItems: "center" }}>
      <div style={{ flex: 1, border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: "6px 10px", fontSize: 9, color: MUTED }}>メッセージを入力…</div>
      <div style={{ width: 26, height: 26, borderRadius: "50%", backgroundColor: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>↑</div>
    </div>
  </div>
);

// ───────── S12 プロフィール（自分） ─────────
const S12 = () => (
  <div style={{ height: "100%", backgroundColor: BG, display: "flex", flexDirection: "column" }}>
    <div style={{ backgroundColor: WHITE, padding: "16px 14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, borderBottom: `1px solid ${BORDER}` }}>
      <Avatar ch="N" size={52} />
      <div style={{ fontSize: 13, fontWeight: 800 }}>ナオキ</div>
      <div style={{ fontSize: 8, color: MUTED }}>26歳・社会人ランナー</div>
      <div style={{ display: "flex", gap: 4 }}>
        <Tag yellow>アマチュア</Tag><Tag>5:00/km</Tag><Tag>大阪</Tag>
      </div>
    </div>
    <div style={{ flex: 1, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ backgroundColor: WHITE, borderRadius: 12, padding: "10px 12px", border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 9, fontWeight: 700, marginBottom: 4 }}>自己紹介</div>
        <div style={{ fontSize: 8, color: "#666", lineHeight: 1.6 }}>週3で走っています。フルマラソン完走が目標です。一緒に頑張れる仲間募集中！</div>
      </div>
      <div style={{ backgroundColor: WHITE, borderRadius: 12, padding: "10px 12px", border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
        {[["12", "参加回数"], ["3", "主催回数"], ["8", "お気に入り"]].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>{n}</div>
            <div style={{ fontSize: 7, color: MUTED }}>{l}</div>
          </div>
        ))}
      </div>
      <Btn primary={false}>プロフィールを編集</Btn>
    </div>
    <TabBar active={2} />
  </div>
);

// ───────── S13 他ユーザープロフィール ─────────
const S13 = () => (
  <div style={{ height: "100%", backgroundColor: BG, display: "flex", flexDirection: "column" }}>
    <Head title="" />
    <div style={{ backgroundColor: WHITE, padding: "12px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, borderBottom: `1px solid ${BORDER}` }}>
      <Avatar ch="リ" size={52} />
      <div style={{ fontSize: 13, fontWeight: 800 }}>リョースケ</div>
      <div style={{ fontSize: 8, color: MUTED }}>24歳・社会人ランナー</div>
      <div style={{ display: "flex", gap: 4 }}>
        <Tag yellow>アマチュア</Tag><Tag>4:20/km</Tag><Tag>大阪</Tag>
      </div>
    </div>
    <div style={{ flex: 1, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ backgroundColor: WHITE, borderRadius: 12, padding: "10px 12px", border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 9, fontWeight: 700, marginBottom: 4 }}>自己紹介</div>
        <div style={{ fontSize: 8, color: "#666", lineHeight: 1.6 }}>平日夜と週末に走っています。サブ3目指して練習中です！</div>
      </div>
      <div style={{ backgroundColor: WHITE, borderRadius: 12, padding: "10px 12px", border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 9, fontWeight: 700, marginBottom: 5 }}>募集中</div>
        <div style={{ fontSize: 8, color: "#666" }}>🏃 山田池公園で10kmジョグしましょう！</div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <Btn primary={false} style={{ fontSize: 9 }}>通報</Btn>
        <Btn style={{ fontSize: 9 }}>募集を見る</Btn>
      </div>
    </div>
    <TabBar active={1} />
  </div>
);

// ───────── 簡易遷移図 ─────────
const Node = ({ children, home = false }) => (
  <span style={{
    padding: "3px 9px", borderRadius: 7, fontSize: 10, fontWeight: 700,
    backgroundColor: home ? YELLOW : WHITE, color: BLACK,
    border: `1.5px solid ${home ? BLACK : "#CCC"}`, whiteSpace: "nowrap",
  }}>{children}</span>
);
const Arr = ({ label }) => (
  <span style={{ fontSize: 9, color: "#888", whiteSpace: "nowrap" }}>
    {label ? `─${label}→` : "→"}
  </span>
);

const FlowDiagram = () => (
  <div style={{
    maxWidth: 720, margin: "0 auto 32px", backgroundColor: WHITE,
    borderRadius: 12, padding: "14px 18px", border: `1px solid #DDD`,
    display: "flex", flexDirection: "column", gap: 10,
  }}>
    <div style={{ fontSize: 12, fontWeight: 800, color: BLACK }}>画面遷移（簡易）</div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <Node>S01 スプラッシュ</Node><Arr />
      <Node>S02 ログイン</Node><span style={{ fontSize: 9, color: "#888" }}>⇄</span>
      <Node>S03 新規登録</Node><Arr />
      <Node home>S04 さがす ★ホーム</Node>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <Node home>S04</Node><Arr label="絞り込み" /><Node>S05 フィルター</Node>
      <span style={{ fontSize: 9, color: "#BBB" }}>／</span>
      <Node home>S04</Node><Arr label="＋" /><Node>S07 募集作成</Node>
      <span style={{ fontSize: 9, color: "#BBB" }}>（どちらもS04へ戻る）</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <Node home>S04</Node><Arr label="カード" />
      <Node>S06 募集詳細</Node><Arr label="申請" />
      <Node>S08 参加申請</Node><Arr label="承認後" />
      <Node>S09 グループ</Node><Arr label="トーク" />
      <Node>S11 トークルーム</Node>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <Node>S10 はなす</Node><Arr label="グループ" /><Node>S11 トークルーム</Node>
      <span style={{ fontSize: 9, color: "#BBB" }}>／</span>
      <Node>S12 プロフィール</Node><Arr label="他ユーザー" /><Node>S13 他人プロフ</Node>
    </div>
    <div style={{ fontSize: 9, color: "#888" }}>
      タブバー（はなす S10 ／ さがす S04 ／ プロフィール S12）はログイン後どの画面からも行き来可能
    </div>
  </div>
);

// ───────── 全体レイアウト ─────────
const SCREENS = [
  ["S01 スプラッシュ", <S01 />],
  ["S02 ログイン", <S02 />],
  ["S03 新規登録", <S03 />],
  ["S04 募集一覧（さがす）", <S04 />],
  ["S05 検索フィルター", <S05 />],
  ["S06 募集詳細", <S06 />],
  ["S07 募集作成", <S07 />],
  ["S08 参加申請", <S08 />],
  ["S09 参加したグループ", <S09 />],
  ["S10 トーク一覧（はなす）", <S10 />],
  ["S11 トークルーム", <S11 />],
  ["S12 プロフィール（自分）", <S12 />],
  ["S13 他ユーザープロフィール", <S13 />],
];

export default function App() {
  const [zoom, setZoom] = useState(null);

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#EDEBE6",
      fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
      padding: "36px 24px",
    }}>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Bird size={40} />
          <div style={{ fontSize: 30, fontWeight: 900, color: BLACK }}>
            MeT<span style={{ color: "#D9A800" }}>oo</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>UI設計 — 全13画面（クリックで拡大）</div>
      </div>

      <div style={{
        maxWidth: 720, margin: "0 auto 32px", backgroundColor: WHITE,
        borderRadius: 12, padding: "12px 18px", fontSize: 11, color: "#555",
        border: `1px solid #DDD`, lineHeight: 1.8,
      }}>
        <b>確定構成：</b>Next.js + TypeScript / NextAuth.js / Neon + Prisma / Cloudflare R2 / Vercel / Pusher<br />
        <b>UI：</b>黄 {YELLOW}・黒 {BLACK}・白カード・グレータグ／3タブ（はなす・さがす・プロフィール）／椋鳥マスコット（CSS仮置き、デザイナー素材に差し替え予定）
      </div>

      <FlowDiagram />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
        gap: 28, maxWidth: 1100, margin: "0 auto", justifyItems: "center",
      }}>
        {SCREENS.map(([name, comp]) => (
          <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer" }}
            onClick={() => setZoom(name)}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#444" }}>{name}</div>
            <div style={{
              width: 185, height: 360, borderRadius: 24, border: `2.5px solid ${BLACK}`,
              overflow: "hidden", backgroundColor: WHITE, boxShadow: "3px 3px 0 rgba(0,0,0,0.85)",
            }}>
              <div style={{ width: 185, height: 360 }}>{comp}</div>
            </div>
          </div>
        ))}
      </div>

      {zoom && (
        <div onClick={() => setZoom(null)} style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, zIndex: 50,
        }}>
          <div style={{ color: WHITE, fontSize: 14, fontWeight: 700 }}>{zoom}</div>
          <div onClick={e => e.stopPropagation()} style={{
            width: 300, height: 584, borderRadius: 34, border: `4px solid ${BLACK}`,
            overflow: "hidden", backgroundColor: WHITE, boxShadow: "0 16px 48px rgba(0,0,0,0.45)",
          }}>
            <div style={{ width: 185, height: 360, transform: "scale(1.62)", transformOrigin: "top left" }}>
              {SCREENS.find(([n]) => n === zoom)?.[1]}
            </div>
          </div>
          <div style={{ color: "#CCC", fontSize: 11 }}>背景クリックで閉じる</div>
        </div>
      )}
    </div>
  );
}
