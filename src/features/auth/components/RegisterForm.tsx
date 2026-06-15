"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, display_name: displayName }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "エラーが発生しました" }));
      setError((data as { error?: string }).error ?? "エラーが発生しました");
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-red-500 text-sm text-center" role="alert">
          {error}
        </p>
      )}
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
          表示名
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          maxLength={50}
          placeholder="ランナー名"
          className="w-full border border-[#E6E6E6] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="example@email.com"
          className="w-full border border-[#E6E6E6] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
          パスワード
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="8文字以上"
          className="w-full border border-[#E6E6E6] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] bg-white"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#F5C518] text-[#1A1A1A] font-bold py-3 rounded-full text-sm disabled:opacity-50 mt-2"
      >
        {loading ? "登録中..." : "登録する"}
      </button>
      <p className="text-center text-sm text-[#999999]">
        アカウントをお持ちの方は{" "}
        <Link href="/login" className="text-[#1A1A1A] underline">
          ログイン
        </Link>
      </p>
    </form>
  );
}
