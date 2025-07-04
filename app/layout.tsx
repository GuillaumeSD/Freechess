import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://chesskit.org"),
  title: {
    default: "Chesskit - Free Chess Game Analysis",
    template: "%s | Chesskit",
  },
  description:
    "Analyze your chess games for free with Chesskit. Support for Chess.com, Lichess, and PGN files. No ads, no subscriptions, open-source and privacy-focused.",
  keywords: [
    "chess analysis",
    "free chess analyzer",
    "chess.com analysis",
    "lichess analysis",
    "PGN analysis",
    "chess improvement",
    "chess tools",
    "open source chess",
  ],
  authors: [{ name: "Chesskit Team" }],
  creator: "Chesskit Team",
  publisher: "Chesskit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: "/android-chrome-192x192.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chesskit.org",
    title: "Chesskit - Free Chess Game Analysis",
    description:
      "Analyze your chess games for free. Support for Chess.com, Lichess, and PGN files. No ads, no subscriptions.",
    siteName: "Chesskit",
    images: [
      {
        url: "/social-networks-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Chesskit - Free Chess Game Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chesskit - Free Chess Game Analysis",
    description:
      "Analyze your chess games for free. Support for Chess.com, Lichess, and PGN files.",
    creator: "@chesskit",
    images: ["/social-networks-1200x630.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
