import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  hash: vi.fn().mockResolvedValue("hashed_password"),
  compare: vi.fn(),
}));

import { registerUser } from "@/features/auth";
import { prisma } from "@/lib/prisma";

const mockPrisma = prisma as unknown as {
  user: { findUnique: ReturnType<typeof vi.fn> };
  $transaction: ReturnType<typeof vi.fn>;
};

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("メール形式が不正な場合はエラーを返す", async () => {
    const result = await registerUser({
      email: "not-an-email",
      password: "password123",
      display_name: "テスト",
    });
    expect("error" in result).toBe(true);
  });

  it("パスワードが8文字未満の場合はエラーを返す", async () => {
    const result = await registerUser({
      email: "test@example.com",
      password: "short",
      display_name: "テスト",
    });
    expect("error" in result).toBe(true);
  });

  it("表示名が空の場合はエラーを返す", async () => {
    const result = await registerUser({
      email: "test@example.com",
      password: "password123",
      display_name: "",
    });
    expect("error" in result).toBe(true);
  });

  it("すでに登録済みのメールアドレスはエラーを返す", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "existing-id",
      email: "existing@example.com",
    });

    const result = await registerUser({
      email: "existing@example.com",
      password: "password123",
      display_name: "テスト",
    });

    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toContain("すでに登録");
    }
  });

  it("正常な入力でユーザーとプロフィールを作成してIDとメールを返す", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const createdUser = { id: "new-uuid", email: "new@example.com" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockPrisma.$transaction.mockImplementation(async (fn: any) => {
      return fn({ user: { create: vi.fn().mockResolvedValue(createdUser) } });
    });

    const result = await registerUser({
      email: "new@example.com",
      password: "password123",
      display_name: "新規ユーザー",
    });

    expect("id" in result).toBe(true);
    expect("error" in result).toBe(false);
    if ("id" in result) {
      expect(result.id).toBe("new-uuid");
      expect(result.email).toBe("new@example.com");
    }
    expect(mockPrisma.$transaction).toHaveBeenCalledOnce();
  });
});
