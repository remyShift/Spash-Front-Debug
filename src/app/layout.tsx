import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Debug Spash Devtool",
  description: "Tool to help Spash developers debug AI results !",
};

const gilRoy = localFont({
  src: [
    {
      path: "../../public/fonts/Gilroy-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Gilroy-SemiBold-Italic.ttf",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-gilroy",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${gilRoy.variable}`}>{children}</body>
    </html>
  );
}
