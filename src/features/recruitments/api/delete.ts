import { prisma } from "@/lib/prisma";
import type { ApiResult } from "@/features/recruitments/types";

export async function deleteRecruitment(
  id: string,
  userId: string,
): Promise<ApiResult<{ deleted: true }>> {
  const existing = await prisma.recruitment.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing) {
    return { ok: false, status: 404, error: "募集が見つかりません" };
  }
  if (existing.userId !== userId) {
    return { ok: false, status: 403, error: "この募集を削除する権限がありません" };
  }

  await prisma.recruitment.delete({ where: { id } });
  return { ok: true, data: { deleted: true } };
}
