import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dinisir Language",
  description: "This is Dinisir Language Translator Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body>{children}</body>
    </html>
  );
}
