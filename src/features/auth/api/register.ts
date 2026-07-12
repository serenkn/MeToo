import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { registerSchema } from "@/features/auth/types";

export async function registerUser(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力内容が正しくありません" };
  }

  const { email, password, display_name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "このメールアドレスはすでに登録されています" };
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    return tx.user.create({
      data: {
        email,
        password: passwordHash,
        profile: {
          create: { displayName: display_name },
        },
      },
      select: { id: true, email: true },
    });
  });

  return { id: user.id, email: user.email };
}
