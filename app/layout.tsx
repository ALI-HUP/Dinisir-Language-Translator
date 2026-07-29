import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const farBassam = localFont({
  src: "../public/font/Far_Casablanca.ttf",
  variable: "--font-far-bassam",
  display: "swap",
});

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
    <html lang="fa" dir="rtl" className={farBassam.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
