import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata: Metadata = {
  title: "Debug Spash Devtool",
  description: "Tool to help Spash developers debug AI results !",
};

const gilRoy = localFont({
  src: [
    {
      path: "../../public/fonts/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
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
    {
      path: "../../public/fonts/Gilroy-SemiBold.ttf",
      weight: "600",
      style: "normal",
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
    <html lang="en">
      <body className={`${gilRoy.variable} font-gilroy mesh-bg`}>
        {children}
      </body>
    </html>
  );
}
