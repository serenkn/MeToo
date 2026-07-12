import { prisma } from "@/lib/prisma";
import {
  updateRecruitmentSchema,
  type ApiResult,
  type RecruitmentDetail,
} from "@/features/recruitments/types";
import { recruitmentInclude, toDetail } from "./shared";

export async function updateRecruitment(
  id: string,
  userId: string,
  input: unknown,
): Promise<ApiResult<RecruitmentDetail>> {
  const parsed = updateRecruitmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: parsed.error.issues[0]?.message ?? "入力内容が正しくありません",
    };
  }

  const existing = await prisma.recruitment.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing) {
    return { ok: false, status: 404, error: "募集が見つかりません" };
  }
  if (existing.userId !== userId) {
    return { ok: false, status: 403, error: "この募集を編集する権限がありません" };
  }

  const d = parsed.data;
  const record = await prisma.recruitment.update({
    where: { id },
    data: {
      ...(d.title !== undefined ? { title: d.title } : {}),
      ...(d.body !== undefined ? { body: d.body } : {}),
      ...(d.sport_type !== undefined ? { sportType: d.sport_type } : {}),
      ...(d.pace !== undefined ? { pace: d.pace } : {}),
      ...(d.distance_km !== undefined ? { distanceKm: d.distance_km } : {}),
      ...(d.level !== undefined ? { level: d.level } : {}),
      ...(d.max_members !== undefined ? { maxMembers: d.max_members } : {}),
      ...(d.meet_at !== undefined ? { meetAt: new Date(d.meet_at) } : {}),
      ...(d.location_name !== undefined ? { locationName: d.location_name } : {}),
      ...(d.location_address !== undefined ? { locationAddress: d.location_address } : {}),
      ...(d.location_lat !== undefined ? { locationLat: d.location_lat } : {}),
      ...(d.location_lng !== undefined ? { locationLng: d.location_lng } : {}),
      ...(d.course !== undefined ? { course: d.course } : {}),
      ...(d.notes !== undefined ? { notes: d.notes } : {}),
      ...(d.area !== undefined ? { area: d.area } : {}),
      ...(d.status !== undefined ? { status: d.status } : {}),
    },
    include: recruitmentInclude(userId),
  });

  return { ok: true, data: toDetail(record) };
}
