import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fixlab — IT Support Learning Center",
  description: "เรียนรู้ทักษะ IT Support ผ่านบทเรียนและสถานการณ์จำลองที่ใช้ได้จริง"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
