import { LoginForm } from "@/features/auth";

export const metadata = { title: "ログイン | MeToo" };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-2 text-center">MeToo</h1>
      <p className="text-[#999999] text-sm text-center mb-8">ランナーとつながろう</p>
      <LoginForm />
    </>
  );
}
