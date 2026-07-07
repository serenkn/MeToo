import { prisma } from "@/lib/prisma";
import type { ApiResult, RecruitmentDetail } from "@/features/recruitments/types";
import { recruitmentInclude, toDetail } from "./shared";

export async function getRecruitment(
  id: string,
  userId: string,
): Promise<ApiResult<RecruitmentDetail>> {
  const record = await prisma.recruitment.findUnique({
    where: { id },
    include: recruitmentInclude(userId),
  });
  if (!record) {
    return { ok: false, status: 404, error: "募集が見つかりません" };
  }
  return { ok: true, data: toDetail(record) };
}
