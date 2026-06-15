import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/features/auth";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const result = await registerUser(body);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
