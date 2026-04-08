import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Facebook/TikTok Batch Uploader - Screenshot & Hashtag Validator",
  description: "Hệ thống xử lý hàng loạt screenshot Facebook/TikTok với kiểm tra hashtag tự động. Hỗ trợ lên đến 200 shops, 8 posts/shop với tỷ lệ thành công 95-99%.",
  keywords: "facebook, tiktok, screenshot, batch upload, hashtag validator, automation"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
