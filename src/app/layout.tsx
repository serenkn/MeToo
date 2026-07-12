import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeToo",
  description: "ランナー向けコミュニティマッチングアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full bg-[#F7F7F7] text-[#1A1A1A] antialiased">
        {children}
      </body>
    </html>
  );
}
