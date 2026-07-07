import Link from "next/link";
import { RecruitmentForm } from "@/features/recruitments";

export const metadata = { title: "募集作成 | MeToo" };

// S07 募集作成
export default function NewRecruitmentPage() {
  return (
    <div className="mx-auto max-w-md">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#E6E6E6] bg-white px-4 py-3">
        <Link href="/" aria-label="戻る" className="text-lg text-[#1A1A1A]">
          ←
        </Link>
        <h1 className="text-base font-bold text-[#1A1A1A]">募集作成</h1>
      </header>
      <main className="px-4 py-5">
        <RecruitmentForm />
      </main>
    </div>
  );
}
