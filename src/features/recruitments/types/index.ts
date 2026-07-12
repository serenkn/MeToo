import { z } from "zod";

export const LEVELS = ["beginner", "amateur", "pro", "club"] as const;
export type Level = (typeof LEVELS)[number];

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: "ビギナー",
  amateur: "アマチュア",
  pro: "プロ",
  club: "クラブ",
};

const isoDateString = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), "日時の形式が正しくありません");

export const createRecruitmentSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(100),
  body: z.string().min(1, "本文は必須です"),
  sport_type: z.string().min(1, "スポーツ種別は必須です").max(50),
  pace: z.string().max(20).nullish(),
  distance_km: z.number().positive().max(9999.9).nullish(),
  level: z.enum(LEVELS, "レベルの値が不正です"),
  max_members: z.number().int().positive().nullish(),
  meet_at: isoDateString,
  location_name: z.string().max(200).nullish(),
  location_address: z.string().max(200).nullish(),
  location_lat: z.number().min(-90).max(90).nullish(),
  location_lng: z.number().min(-180).max(180).nullish(),
  course: z.string().nullish(),
  notes: z.string().nullish(),
  area: z.string().max(100).nullish(),
});

export const updateRecruitmentSchema = createRecruitmentSchema.partial().extend({
  status: z.enum(["open", "closed", "cancelled"]).optional(),
});

export const listRecruitmentsQuerySchema = z.object({
  area: z.string().optional(),
  distance_min: z.coerce.number().nonnegative().optional(),
  distance_max: z.coerce.number().positive().optional(),
  pace: z.string().optional(),
  // docs/04 に比較方法の記載がないため「募集人数が指定値以下」で実装（要確認）
  max_members: z.coerce.number().int().positive().optional(),
  level: z.enum(LEVELS).optional(),
  date: z.enum(["today", "this_week", "this_month"]).optional(),
  sort: z.enum(["new", "meet_at"]).default("new"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateRecruitmentInput = z.infer<typeof createRecruitmentSchema>;
export type UpdateRecruitmentInput = z.infer<typeof updateRecruitmentSchema>;
export type ListRecruitmentsQuery = z.infer<typeof listRecruitmentsQuerySchema>;

// docs/04 のレスポンスI/F（snake_case）
export type RecruitmentHost = {
  id: string;
  display_name: string;
  age: number | null;
  attribute: string | null;
  avatar_url: string | null;
};

export type RecruitmentListItem = {
  id: string;
  title: string;
  body: string;
  pace: string | null;
  distance_km: number | null;
  level: string;
  max_members: number | null;
  meet_at: string;
  area: string | null;
  status: string;
  host: RecruitmentHost;
  member_count: number;
  is_favorite: boolean;
};

export type RecruitmentDetail = RecruitmentListItem & {
  sport_type: string;
  location_name: string | null;
  location_address: string | null;
  location_lat: number | null;
  location_lng: number | null;
  course: string | null;
  notes: string | null;
  created_at: string;
};

export type ListRecruitmentsResponse = {
  total: number;
  page: number;
  limit: number;
  data: RecruitmentListItem[];
};

// feature内API関数の共通戻り値（Route Handlerがstatusにマップする）
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: 400 | 403 | 404; error: string };
