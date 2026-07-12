import { prisma } from "@/lib/prisma";
import {
  createRecruitmentSchema,
  type ApiResult,
  type RecruitmentDetail,
} from "@/features/recruitments/types";
import { recruitmentInclude, toDetail } from "./shared";

export async function createRecruitment(
  userId: string,
  input: unknown,
): Promise<ApiResult<RecruitmentDetail>> {
  const parsed = createRecruitmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: parsed.error.issues[0]?.message ?? "入力内容が正しくありません",
    };
  }
  const d = parsed.data;

  const record = await prisma.recruitment.create({
    data: {
      userId,
      title: d.title,
      body: d.body,
      sportType: d.sport_type,
      pace: d.pace ?? null,
      distanceKm: d.distance_km ?? null,
      level: d.level,
      maxMembers: d.max_members ?? null,
      meetAt: new Date(d.meet_at),
      locationName: d.location_name ?? null,
      locationAddress: d.location_address ?? null,
      locationLat: d.location_lat ?? null,
      locationLng: d.location_lng ?? null,
      course: d.course ?? null,
      notes: d.notes ?? null,
      area: d.area ?? null,
      status: "open",
    },
    include: recruitmentInclude(userId),
  });

  return { ok: true, data: toDetail(record) };
}
