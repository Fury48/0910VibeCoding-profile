import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "최동주 — 하계동",
  description: "최동주 소개 페이지 — 우주에서 하계동까지 줌인",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
