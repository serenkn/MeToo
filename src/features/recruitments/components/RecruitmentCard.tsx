import Link from "next/link";
import type { RecruitmentListItem } from "@/features/recruitments/types";
import { LEVEL_LABELS, type Level } from "@/features/recruitments/types";

function formatMeetAt(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-[#F7F7F7] px-2.5 py-0.5 text-xs text-[#1A1A1A]">
      {children}
    </span>
  );
}

export function RecruitmentCard({ item }: { item: RecruitmentListItem }) {
  const initial = item.host.display_name.charAt(0) || "?";
  const hostMeta = [
    item.host.age !== null ? `${item.host.age}歳` : null,
    item.host.attribute,
  ]
    .filter(Boolean)
    .join("・");

  return (
    <Link
      href={`/recruitments/${item.id}`}
      className="block rounded-2xl border border-[#E6E6E6] bg-white p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6E6E6] text-sm font-bold text-[#1A1A1A]">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-[#999999]">
            {item.host.display_name}
            {hostMeta ? `（${hostMeta}）` : ""}
          </p>
          <h3 className="mt-0.5 truncate text-base font-bold text-[#1A1A1A]">{item.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-[#999999]">{item.body}</p>
        </div>
        <span className="text-lg" aria-label={item.is_favorite ? "お気に入り済み" : "お気に入り"}>
          {item.is_favorite ? "★" : "☆"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.pace && <Tag>{item.pace}</Tag>}
        {item.max_members !== null && (
          <Tag>
            {item.member_count}/{item.max_members}人
          </Tag>
        )}
        {item.distance_km !== null && <Tag>{item.distance_km}km</Tag>}
        <Tag>{formatMeetAt(item.meet_at)}</Tag>
        {item.area && <Tag>{item.area}</Tag>}
        <Tag>{LEVEL_LABELS[item.level as Level] ?? item.level}</Tag>
      </div>
    </Link>
  );
}
