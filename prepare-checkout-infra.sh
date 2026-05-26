#!/usr/bin/env bash
set -euo pipefail

echo "==> 1. Installing Stripe frontend & backend dependencies..."
npm install stripe @stripe/stripe-js

echo "==> 2. Preparing database for Payment Idempotency..."
mkdir -p scripts

# יצירת סקריפט הרצה שמזהה אוטומטית את פרטי בסיס הנתונים מתוך קובץ ה-.env שלך
cat > scripts/migrate-payments.js <<'EOF'
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// קריאה ידנית עדינה של קובץ ה-.env למקרה שמריצים לוקאלית
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^DATABASE_URL=["']?(.+?)["']?$/m);
    if (match) databaseUrl = match[1];
  }
}

if (!databaseUrl) {
  console.error("❌ Error: DATABASE_URL not found in environment or .env file.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log("⏳ Modifying 'actions' table to ensure payment idempotency...");
    
    // הוספת עמודה לזיהוי סשן התשלום של סטרייפ
    await client.query(`
      ALTER TABLE actions ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255);
    `);

    // יצירת אינדקס ייחודי חלקי - מאפשר הרבה ערכי NULL (עבור פעולות חינמיות) אבל אוכף ייחודיות מוחלטת על ערכים קיימים (תשלומים)
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_actions_stripe_session_id 
      ON actions(stripe_session_id) 
      WHERE stripe_session_id IS NOT NULL;
    `);

    console.log("✅ Database migration completed successfully!");
  } catch (err) {
    console.error("❌ Database migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
EOF

# הרצת המיגרציה
node scripts/migrate-payments.js

echo "==> 3. Upgrading SEO, OpenGraph, and AIO (AI Search Optimization) Metadata..."
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
  
  // הגדרות SEO ואינדוקס מתקדמות (מותאם גם ל-AI Crawlers / AIO)
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

  // תגי OpenGraph עבור שיתופים חברתיים (פייסבוק, וואטסאפ, לינקדאין, רדיט)
  openGraph: {
    title: "Countt | The Global Social Experiment",
    description: "One global number. Everyone can move it. Will we cooperate to build, or intervene to disrupt?",
    url: "https://countt.co", //
    siteName: "Countt",
    locale: "en_US",
    type: "website",
  },

  // תגים ייעודיים עבור פלטפורמת X (טוויטר לשעבר)
  twitter: {
    card: "summary_large_image",
    title: "Countt | The Global Social Experiment",
    description: "One global number controlled by collective human intent. Will we build or destroy?",
  },

  // תגים משלימים מובנים עבור מערכות אופטימיזציה מודרניות
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

echo "==> 4. Committing and pushing core infrastructure..."
git add .
git commit -m "Install Stripe, enforce payment idempotency constraint in DB, and upgrade global SEO/OG/AIO metadata"
git push

echo "🚀 All systems ready! Core infrastructure is locked and deployed."
