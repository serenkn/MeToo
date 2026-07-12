"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEVELS, LEVEL_LABELS } from "@/features/recruitments/types";

const inputClass =
  "w-full border border-[#E6E6E6] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#1A1A1A]">{label}</label>
      {children}
    </div>
  );
}

export function RecruitmentForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const f = new FormData(e.currentTarget);
    const str = (name: string) => {
      const v = f.get(name);
      return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
    };
    const num = (name: string) => {
      const v = str(name);
      return v !== undefined ? Number(v) : undefined;
    };

    const meetAtLocal = str("meet_at");
    const body = {
      title: str("title"),
      body: str("body"),
      sport_type: str("sport_type"),
      pace: str("pace"),
      distance_km: num("distance_km"),
      level: str("level"),
      max_members: num("max_members"),
      meet_at: meetAtLocal ? new Date(meetAtLocal).toISOString() : undefined,
      location_name: str("location_name"),
      location_address: str("location_address"),
      location_lat: num("location_lat"),
      location_lng: num("location_lng"),
      course: str("course"),
      notes: str("notes"),
      area: str("area"),
    };

    setLoading(true);
    const res = await fetch("/api/recruitments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "投稿に失敗しました");
      return;
    }

    // docs/01 遷移図：S07 投稿 → S04（一覧）
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-8">
      {error && (
        <p className="text-center text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      <Field label="スポーツ種別">
        <input name="sport_type" required placeholder="ランニング" className={inputClass} />
      </Field>
      <Field label="タイトル">
        <input name="title" required maxLength={100} placeholder="朝ラン仲間募集！" className={inputClass} />
      </Field>
      <Field label="日時">
        <input name="meet_at" type="datetime-local" required className={inputClass} />
      </Field>
      <Field label="集合場所（名称）">
        <input name="location_name" maxLength={200} placeholder="大阪城公園 太陽の広場" className={inputClass} />
      </Field>
      <Field label="集合場所（住所）">
        <input name="location_address" maxLength={200} placeholder="大阪市中央区大阪城3-11" className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="緯度（任意）">
          <input name="location_lat" type="number" step="any" placeholder="34.6873" className={inputClass} />
        </Field>
        <Field label="経度（任意）">
          <input name="location_lng" type="number" step="any" placeholder="135.5262" className={inputClass} />
        </Field>
      </div>
      <Field label="エリア">
        <input name="area" maxLength={100} placeholder="大阪" className={inputClass} />
      </Field>
      <Field label="予定コース">
        <textarea name="course" rows={2} placeholder="公園内周回コース 1周3.5km" className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="距離（km）">
          <input name="distance_km" type="number" step="0.1" min="0.1" placeholder="10" className={inputClass} />
        </Field>
        <Field label="ペース">
          <input name="pace" maxLength={20} placeholder="5:30/km" className={inputClass} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="レベル">
          <select name="level" required defaultValue="beginner" className={inputClass}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABELS[l]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="募集人数">
          <input name="max_members" type="number" min="1" placeholder="10" className={inputClass} />
        </Field>
      </div>
      <Field label="荷物・その他">
        <textarea name="notes" rows={2} placeholder="更衣室・ロッカーあり" className={inputClass} />
      </Field>
      <Field label="コメント">
        <textarea name="body" required rows={4} placeholder="初心者歓迎です！一緒に楽しく走りましょう" className={inputClass} />
      </Field>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#F5C518] py-3 text-sm font-bold text-[#1A1A1A] disabled:opacity-50"
      >
        {loading ? "投稿中..." : "募集を投稿する"}
      </button>
    </form>
  );
}
