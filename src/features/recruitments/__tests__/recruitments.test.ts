import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    recruitment: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import {
  listRecruitments,
  createRecruitment,
  updateRecruitment,
  deleteRecruitment,
} from "@/features/recruitments";
import { prisma } from "@/lib/prisma";

const mockPrisma = prisma as unknown as {
  recruitment: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

const HOST_ID = "host-user-id";
const OTHER_ID = "other-user-id";

const validInput = {
  title: "朝ラン仲間募集",
  body: "初心者歓迎です",
  sport_type: "ランニング",
  level: "beginner",
  meet_at: "2026-08-01T07:00:00.000Z",
};

// prisma create/update が返すレコードのモック
const dbRecord = {
  id: "rec-1",
  title: "朝ラン仲間募集",
  body: "初心者歓迎です",
  sportType: "ランニング",
  pace: null,
  distanceKm: null,
  level: "beginner",
  maxMembers: 10,
  meetAt: new Date("2026-08-01T07:00:00.000Z"),
  locationName: null,
  locationAddress: null,
  locationLat: null,
  locationLng: null,
  course: null,
  notes: null,
  area: "大阪",
  status: "open",
  createdAt: new Date("2026-07-01T00:00:00.000Z"),
  user: {
    id: HOST_ID,
    profile: { displayName: "ホスト", age: 24, attribute: "社会人ランナー", avatarUrl: null },
  },
  _count: { groupMembers: 3 },
  favorites: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createRecruitment のバリデーション", () => {
  it("タイトルが空ならエラー（400）", async () => {
    const result = await createRecruitment(HOST_ID, { ...validInput, title: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
    expect(mockPrisma.recruitment.create).not.toHaveBeenCalled();
  });

  it("levelが不正な値ならエラー（400）", async () => {
    const result = await createRecruitment(HOST_ID, { ...validInput, level: "expert" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
  });

  it("meet_atが日時として解釈できなければエラー（400）", async () => {
    const result = await createRecruitment(HOST_ID, { ...validInput, meet_at: "not-a-date" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
  });

  it("正常な入力なら作成され、docs/04のI/F（snake_case）で返る", async () => {
    mockPrisma.recruitment.create.mockResolvedValue(dbRecord);
    const result = await createRecruitment(HOST_ID, validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.id).toBe("rec-1");
      expect(result.data.sport_type).toBe("ランニング");
      expect(result.data.host.display_name).toBe("ホスト");
      expect(result.data.member_count).toBe(3);
      expect(result.data.is_favorite).toBe(false);
      expect(result.data.status).toBe("open");
    }
    const createArgs = mockPrisma.recruitment.create.mock.calls[0][0];
    expect(createArgs.data.userId).toBe(HOST_ID);
    expect(createArgs.data.status).toBe("open");
  });
});

describe("updateRecruitment の権限チェック", () => {
  it("主催者以外の編集は403で拒否し、updateを呼ばない", async () => {
    mockPrisma.recruitment.findUnique.mockResolvedValue({ userId: HOST_ID });
    const result = await updateRecruitment("rec-1", OTHER_ID, { title: "変更" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
    expect(mockPrisma.recruitment.update).not.toHaveBeenCalled();
  });

  it("存在しない募集は404", async () => {
    mockPrisma.recruitment.findUnique.mockResolvedValue(null);
    const result = await updateRecruitment("missing", HOST_ID, { title: "変更" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(404);
  });

  it("主催者本人なら更新できる", async () => {
    mockPrisma.recruitment.findUnique.mockResolvedValue({ userId: HOST_ID });
    mockPrisma.recruitment.update.mockResolvedValue({ ...dbRecord, title: "変更後" });
    const result = await updateRecruitment("rec-1", HOST_ID, { title: "変更後" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.title).toBe("変更後");
  });

  it("バリデーションエラー（不正なstatus）は400", async () => {
    const result = await updateRecruitment("rec-1", HOST_ID, { status: "finished" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
    expect(mockPrisma.recruitment.findUnique).not.toHaveBeenCalled();
  });
});

describe("deleteRecruitment の権限チェック", () => {
  it("主催者以外の削除は403で拒否し、deleteを呼ばない", async () => {
    mockPrisma.recruitment.findUnique.mockResolvedValue({ userId: HOST_ID });
    const result = await deleteRecruitment("rec-1", OTHER_ID);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(403);
    expect(mockPrisma.recruitment.delete).not.toHaveBeenCalled();
  });

  it("存在しない募集は404", async () => {
    mockPrisma.recruitment.findUnique.mockResolvedValue(null);
    const result = await deleteRecruitment("missing", HOST_ID);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(404);
  });

  it("主催者本人なら削除できる", async () => {
    mockPrisma.recruitment.findUnique.mockResolvedValue({ userId: HOST_ID });
    mockPrisma.recruitment.delete.mockResolvedValue({});
    const result = await deleteRecruitment("rec-1", HOST_ID);
    expect(result.ok).toBe(true);
    expect(mockPrisma.recruitment.delete).toHaveBeenCalledWith({ where: { id: "rec-1" } });
  });
});

describe("listRecruitments", () => {
  it("不正なクエリ（page=0）は400", async () => {
    const result = await listRecruitments({ page: "0" }, HOST_ID);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
  });

  it("不正なlevelは400", async () => {
    const result = await listRecruitments({ level: "expert" }, HOST_ID);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
  });

  it("フィルターがPrismaのwhereに反映される", async () => {
    mockPrisma.recruitment.count.mockResolvedValue(1);
    mockPrisma.recruitment.findMany.mockResolvedValue([dbRecord]);

    const result = await listRecruitments(
      { area: "大阪", level: "beginner", distance_min: "5", distance_max: "15", page: "2", limit: "10" },
      HOST_ID,
    );

    expect(result.ok).toBe(true);
    const findArgs = mockPrisma.recruitment.findMany.mock.calls[0][0];
    expect(findArgs.where).toMatchObject({
      area: "大阪",
      level: "beginner",
      distanceKm: { gte: 5, lte: 15 },
    });
    expect(findArgs.skip).toBe(10);
    expect(findArgs.take).toBe(10);
  });

  it("デフォルトは新着順・20件・1ページ目で、docs/04のI/Fで返る", async () => {
    mockPrisma.recruitment.count.mockResolvedValue(1);
    mockPrisma.recruitment.findMany.mockResolvedValue([dbRecord]);

    const result = await listRecruitments({}, OTHER_ID);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.total).toBe(1);
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.data[0].host.display_name).toBe("ホスト");
    }
    const findArgs = mockPrisma.recruitment.findMany.mock.calls[0][0];
    expect(findArgs.orderBy).toEqual({ createdAt: "desc" });
    expect(findArgs.skip).toBe(0);
    expect(findArgs.take).toBe(20);
  });

  it("sort=meet_at なら開催日時の昇順", async () => {
    mockPrisma.recruitment.count.mockResolvedValue(0);
    mockPrisma.recruitment.findMany.mockResolvedValue([]);

    await listRecruitments({ sort: "meet_at" }, HOST_ID);
    const findArgs = mockPrisma.recruitment.findMany.mock.calls[0][0];
    expect(findArgs.orderBy).toEqual({ meetAt: "asc" });
  });
});
