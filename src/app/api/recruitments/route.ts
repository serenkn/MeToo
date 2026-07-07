import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listRecruitments, createRecruitment } from "@/features/recruitments";

// 認証はproxyに依存せず、各ハンドラで独立検証する（docs/04 方針）
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const query = Object.fromEntries(request.nextUrl.searchParams);
  const result = await listRecruitments(query, session.user.id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // 一覧系APIの短いキャッシュ（CLAUDE.md コスト制約）。is_favorite を含むため private
  return NextResponse.json(result.data, {
    headers: { "Cache-Control": "private, max-age=10, stale-while-revalidate=30" },
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストボディが不正です" }, { status: 400 });
  }

  const result = await createRecruitment(session.user.id, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result.data, { status: 201 });
}
