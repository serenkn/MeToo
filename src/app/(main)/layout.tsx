import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// proxy.ts とは独立してセッションを検証する（CVE-2025-29927 対策）
// proxy はUXリダイレクト専用。データ保護はこのレイアウトが担う
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <>{children}</>;
}
