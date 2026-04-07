import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foliocraft — Portfolio Books",
  description: "부트캠프 운영자를 위한 수료 포트폴리오 북 제작 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-[color:var(--text-default)]">{children}</body>
    </html>
  );
}
