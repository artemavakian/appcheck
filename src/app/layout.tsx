import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppCheck — Check Your App Before Apple Does",
  description:
    "AppCheck analyzes your App Store submission and flags potential rejection risks before you wait days for review.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
