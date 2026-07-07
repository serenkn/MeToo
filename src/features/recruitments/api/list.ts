import { prisma } from "@/lib/prisma";
import {
  listRecruitmentsQuerySchema,
  type ApiResult,
  type ListRecruitmentsResponse,
} from "@/features/recruitments/types";
import { recruitmentInclude, toListItem } from "./shared";

// date パラメータの起点は「今日の0時」。today=今日中 / this_week=7日以内 / this_month=1ヶ月以内
function dateRange(date: "today" | "this_week" | "this_month"): { gte: Date; lte: Date } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  if (date === "today") {
    end.setDate(end.getDate() + 1);
  } else if (date === "this_week") {
    end.setDate(end.getDate() + 7);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return { gte: start, lte: end };
}

export async function listRecruitments(
  rawQuery: Record<string, string | undefined>,
  userId: string,
): Promise<ApiResult<ListRecruitmentsResponse>> {
  const parsed = listRecruitmentsQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: parsed.error.issues[0]?.message ?? "クエリパラメータが不正です",
    };
  }
  const q = parsed.data;

  const where = {
    ...(q.area ? { area: q.area } : {}),
    ...(q.pace ? { pace: q.pace } : {}),
    ...(q.level ? { level: q.level } : {}),
    ...(q.max_members ? { maxMembers: { lte: q.max_members } } : {}),
    ...(q.distance_min !== undefined || q.distance_max !== undefined
      ? {
          distanceKm: {
            ...(q.distance_min !== undefined ? { gte: q.distance_min } : {}),
            ...(q.distance_max !== undefined ? { lte: q.distance_max } : {}),
          },
        }
      : {}),
    ...(q.date ? { meetAt: dateRange(q.date) } : {}),
  };

  const orderBy =
    q.sort === "meet_at" ? ({ meetAt: "asc" } as const) : ({ createdAt: "desc" } as const);

  const [total, records] = await Promise.all([
    prisma.recruitment.count({ where }),
    prisma.recruitment.findMany({
      where,
      orderBy,
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      include: recruitmentInclude(userId),
    }),
  ]);

  return {
    ok: true,
    data: {
      total,
      page: q.page,
      limit: q.limit,
      data: records.map(toListItem),
    },
  };
}
