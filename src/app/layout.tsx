import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Debug Spash Devtool",
  description: "Tool to help Spash developers debug AI results !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
