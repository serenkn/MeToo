import Link from "next/link";
import type { RecruitmentDetail as Detail } from "@/features/recruitments/types";
import { LEVEL_LABELS, type Level } from "@/features/recruitments/types";

function formatMeetAt(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// docs/06：地図APIは使わず、Googleマップへのリンクのみ
function googleMapsUrl(d: Detail): string | null {
  if (d.location_lat !== null && d.location_lng !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${d.location_lat},${d.location_lng}`;
  }
  if (d.location_address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.location_address)}`;
  }
  return null;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-[#F7F7F7] px-2.5 py-0.5 text-xs text-[#1A1A1A]">
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#E6E6E6] pt-4">
      <h2 className="mb-2 text-sm font-bold text-[#1A1A1A]">{title}</h2>
      {children}
    </section>
  );
}

export function RecruitmentDetailView({ detail }: { detail: Detail }) {
  const initial = detail.host.display_name.charAt(0) || "?";
  const hostMeta = [
    detail.host.age !== null ? `${detail.host.age}歳` : null,
    detail.host.attribute,
  ]
    .filter(Boolean)
    .join("・");
  const mapsUrl = googleMapsUrl(detail);

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6E6E6] text-base font-bold text-[#1A1A1A]">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#1A1A1A]">{detail.host.display_name}</p>
          {hostMeta && <p className="text-xs text-[#999999]">{hostMeta}</p>}
        </div>
        <span className="text-xl" aria-label={detail.is_favorite ? "お気に入り済み" : "お気に入り"}>
          {detail.is_favorite ? "★" : "☆"}
        </span>
      </div>

      <h1 className="text-xl font-bold text-[#1A1A1A]">{detail.title}</h1>

      <div className="flex flex-wrap gap-1.5">
        {detail.pace && <Tag>{detail.pace}</Tag>}
        {detail.max_members !== null && (
          <Tag>
            {detail.member_count}/{detail.max_members}人
          </Tag>
        )}
        {detail.distance_km !== null && <Tag>{detail.distance_km}km</Tag>}
        <Tag>{formatMeetAt(detail.meet_at)}</Tag>
        {detail.area && <Tag>{detail.area}</Tag>}
        <Tag>{LEVEL_LABELS[detail.level as Level] ?? detail.level}</Tag>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#1A1A1A]">{detail.body}</p>

      <Section title="集合場所">
        {detail.location_name || detail.location_address ? (
          <div className="space-y-1 text-sm text-[#1A1A1A]">
            {detail.location_name && <p className="font-medium">{detail.location_name}</p>}
            {detail.location_address && <p className="text-[#999999]">{detail.location_address}</p>}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-[#1A1A1A] underline"
              >
                Googleマップで開く
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-[#999999]">未設定</p>
        )}
      </Section>

      {detail.course && (
        <Section title="予定コース">
          <p className="whitespace-pre-wrap text-sm text-[#1A1A1A]">{detail.course}</p>
        </Section>
      )}

      {detail.notes && (
        <Section title="荷物・その他">
          <p className="whitespace-pre-wrap text-sm text-[#1A1A1A]">{detail.notes}</p>
        </Section>
      )}

      <div className="fixed inset-x-0 bottom-0 border-t border-[#E6E6E6] bg-white p-4">
        <div className="mx-auto max-w-md">
          {/* S08 参加申請は次タスクで実装。導線のみ配置 */}
          <Link
            href={`/recruitments/${detail.id}`}
            aria-disabled="true"
            className="block w-full rounded-full bg-[#F5C518] py-3 text-center text-sm font-bold text-[#1A1A1A]"
          >
            参加申請する
          </Link>
        </div>
      </div>
    </div>
  );
}
