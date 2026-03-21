import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-88MYB7YRFP"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-88MYB7YRFP');`}
        </Script>
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
