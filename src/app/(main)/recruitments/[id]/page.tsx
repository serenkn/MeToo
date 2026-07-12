import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRecruitment, RecruitmentDetailView } from "@/features/recruitments";

export const metadata = { title: "募集詳細 | MeToo" };

// S06 募集詳細
export default async function RecruitmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const result = await getRecruitment(id, session.user.id);
  if (!result.ok) {
    if (result.status === 404) notFound();
    throw new Error(result.error);
  }

  return (
    <div className="mx-auto max-w-md">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#E6E6E6] bg-white px-4 py-3">
        <Link href="/" aria-label="戻る" className="text-lg text-[#1A1A1A]">
          ←
        </Link>
        <h1 className="text-base font-bold text-[#1A1A1A]">募集詳細</h1>
      </header>
      <main className="px-4 py-5">
        <RecruitmentDetailView detail={result.data} />
      </main>
    </div>
  );
}
