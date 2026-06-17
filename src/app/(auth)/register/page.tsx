import { RegisterForm } from "@/features/auth";

export const metadata = { title: "新規登録 | MeToo" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2 text-center">新規登録</h1>
      <p className="text-[#999999] text-sm text-center mb-8">MeTooへようこそ</p>
      <RegisterForm />
    </>
  );
}
