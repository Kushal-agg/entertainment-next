import type { Metadata } from "next";
import "./globals.css";
import Header from "~/components/Header";
import { usePathname } from "next/navigation";

export const metadata: Metadata = {
  title: "Next-Entertainment",
  description: "A Next.js app for entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
