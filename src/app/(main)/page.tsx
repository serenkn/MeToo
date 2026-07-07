import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listRecruitments, RecruitmentCard } from "@/features/recruitments";
import type { ListRecruitmentsResponse } from "@/features/recruitments";

export const metadata = { title: "さがす | MeToo" };

// S04 募集一覧（さがす）
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const query = await searchParams;

  let list: ListRecruitmentsResponse | null = null;
  let loadError: string | null = null;
  try {
    const result = await listRecruitments(query, session.user.id);
    if (result.ok) {
      list = result.data;
    } else {
      loadError = result.error;
    }
  } catch {
    loadError = "募集の取得に失敗しました";
  }

  return (
    <div className="mx-auto max-w-md">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E6E6E6] bg-white px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5C518] text-xs font-extrabold text-[#1A1A1A]">
          MT
        </span>
        <span className="border-b-2 border-[#F5C518] pb-0.5 text-sm font-bold text-[#1A1A1A]">
          探す
        </span>
        <Link
          href="/recruitments/new"
          aria-label="募集を作成"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-lg leading-none text-white"
        >
          +
        </Link>
      </header>

      <main className="space-y-4 px-4 py-5">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A]">ランナーを探す</h1>
          <p className="mt-0.5 text-sm text-[#999999]">一緒に走る仲間を見つけよう！</p>
        </div>

        {loadError ? (
          <p className="py-12 text-center text-sm text-[#999999]">{loadError}</p>
        ) : list && list.data.length > 0 ? (
          <>
            <p className="text-xs text-[#999999]">{list.total}件の募集</p>
            <div className="space-y-3">
              {list.data.map((item) => (
                <RecruitmentCard key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : (
          <p className="py-12 text-center text-sm text-[#999999]">
            まだ募集がありません。最初の募集を投稿してみましょう！
          </p>
        )}
      </main>
    </div>
  );
}
