import type { RecruitmentDetail, RecruitmentListItem } from "@/features/recruitments/types";

// findMany/findUnique に共通で渡す include。favorites は呼び出しユーザーの分だけ取る
export function recruitmentInclude(userId: string) {
  return {
    user: {
      select: {
        id: true,
        profile: {
          select: { displayName: true, age: true, attribute: true, avatarUrl: true },
        },
      },
    },
    _count: { select: { groupMembers: true } },
    favorites: { where: { userId }, select: { id: true } },
  } as const;
}

// Prisma の Decimal / Date を docs/04 の JSON 表現に変換する
type RecruitmentRecord = {
  id: string;
  title: string;
  body: string;
  sportType: string;
  pace: string | null;
  distanceKm: unknown;
  level: string;
  maxMembers: number | null;
  meetAt: Date;
  locationName: string | null;
  locationAddress: string | null;
  locationLat: unknown;
  locationLng: unknown;
  course: string | null;
  notes: string | null;
  area: string | null;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    profile: {
      displayName: string;
      age: number | null;
      attribute: string | null;
      avatarUrl: string | null;
    } | null;
  };
  _count: { groupMembers: number };
  favorites: { id: string }[];
};

function toNumberOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  return Number(v);
}

export function toListItem(r: RecruitmentRecord): RecruitmentListItem {
  return {
    id: r.id,
    title: r.title,
    body: r.body,
    pace: r.pace,
    distance_km: toNumberOrNull(r.distanceKm),
    level: r.level,
    max_members: r.maxMembers,
    meet_at: r.meetAt.toISOString(),
    area: r.area,
    status: r.status,
    host: {
      id: r.user.id,
      display_name: r.user.profile?.displayName ?? "",
      age: r.user.profile?.age ?? null,
      attribute: r.user.profile?.attribute ?? null,
      avatar_url: r.user.profile?.avatarUrl ?? null,
    },
    member_count: r._count.groupMembers,
    is_favorite: r.favorites.length > 0,
  };
}

export function toDetail(r: RecruitmentRecord): RecruitmentDetail {
  return {
    ...toListItem(r),
    sport_type: r.sportType,
    location_name: r.locationName,
    location_address: r.locationAddress,
    location_lat: toNumberOrNull(r.locationLat),
    location_lng: toNumberOrNull(r.locationLng),
    course: r.course,
    notes: r.notes,
    created_at: r.createdAt.toISOString(),
  };
}
