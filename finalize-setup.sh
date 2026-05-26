#!/usr/bin/env bash
set -euo pipefail

echo "==> Upgrading SEO, OpenGraph, and AIO Metadata..."
cat > src/app/layout.tsx <<'EOF'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Countt | The Global Social Experiment",
  description: "One global number controlled by collective human intent. Will the internet build or destroy? Join the real-time social experiment exploring online behavioral dynamics, coordination, and momentum.",
  keywords: [
    "Countt", 
    "social experiment", 
    "collective behavior", 
    "global counter", 
    "game theory", 
    "real-time internet experiment", 
    "human coordination", 
    "behavioral trends",
    "Technion project"
  ],
  authors: [{ name: "Information Systems Engineering Student, Technion" }],
  
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Countt | The Global Social Experiment",
    description: "One global number. Everyone can move it. Will we cooperate to build, or intervene to disrupt?",
    url: "https://countt.app",
    siteName: "Countt",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Countt | The Global Social Experiment",
    description: "One global number controlled by collective human intent. Will we build or destroy?",
  },

  other: {
    "ai-content-classification": "open-ended-digital-experiment",
    "experiment-version": "1.1.0"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.className} bg-[#f7f7f5] text-[#111111] antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
EOF

echo "==> Committing and pushing..."
git add .
git commit -m "Install Stripe and upgrade global SEO/OG metadata"
git push

echo "🚀 Done! Infrastructure is fully ready."
