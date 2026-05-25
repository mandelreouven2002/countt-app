#!/usr/bin/env bash
set -euo pipefail

echo "==> Adding Navbar and building About/Terms pages..."

mkdir -p src/app/about
mkdir -p src/app/terms

# 1. יצירת קומפוננטת ה-Navbar
cat > src/components/navbar.tsx <<'EOF'
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/5 bg-[#f7f7f5]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 md:px-12">
        <Link href="/" className="text-2xl font-black tracking-tight">
          Countt
        </Link>
        <nav className="flex gap-6 text-sm font-semibold text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-black transition-colors">
            About
          </Link>
          <Link href="/terms" className="hover:text-black transition-colors">
            Terms
          </Link>
        </nav>
      </div>
    </header>
  );
}
EOF

# 2. עדכון ה-Layout כדי שהתפריט יופיע בכל עמוד
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
  title: "Countt | The Social Experiment",
  description: "One global number. Everyone can move it.",
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

# 3. יצירת עמוד About
cat > src/app/about/page.tsx <<'EOF'
export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 md:p-12 font-sans space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">About Countt</h1>
        <p className="text-xl text-gray-500 font-medium">A real-time exploration of human behavior.</p>
      </div>

      <section className="space-y-4 text-lg text-gray-700 leading-relaxed bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
        <h2 className="text-2xl font-bold text-black">The Experiment</h2>
        <p>
          Countt is an interactive social experiment sitting at the intersection of technology, society, and ethics. 
          We have created one global number and given the internet the power to move it. 
        </p>
        <p>
          The core question is simple: What will happen? When given the choice to build (+0.25) or dismantle (-0.25), 
          which collective instinct will take over? Will we see organized communities working together to drive the 
          number to unprecedented heights, or will chaotic forces push it into the negative? Countt provides a live, 
          transparent mapping of these digital social dynamics.
        </p>
      </section>

      <section className="space-y-4 text-lg text-gray-700 leading-relaxed bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
        <h2 className="text-2xl font-bold text-black">Our Commitment to Culture</h2>
        <p>
          Beyond the digital experiment, we believe in translating digital actions into real-world value. 
          A dedicated portion of all proceeds generated through paid actions on this platform will be directly 
          donated to support and promote cultural initiatives, local communities, and the arts. 
        </p>
        <p>
          Every click not only shapes the global counter but also contributes to fostering real-world human connection and creativity.
        </p>
      </section>
    </main>
  );
}
EOF

# 4. יצירת עמוד Terms מחמיר ומקצועי
cat > src/app/terms/page.tsx <<'EOF'
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 md:p-12 font-sans space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Terms of Service & Privacy</h1>
        <p className="text-lg text-gray-500 font-medium">Last updated: May 2026</p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed bg-white p-8 md:p-10 rounded-[2rem] border border-black/5 shadow-sm">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">1. Data Collection & Privacy</h2>
          <p>
            Transparency and data protection are fundamental to this experiment. When you interact with the counter, we collect minimal data required to maintain the integrity of the platform:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>IP Hashing:</strong> We do not store raw IP addresses. Your IP is immediately hashed using secure cryptographic standards to prevent duplicate free actions while maintaining your anonymity.</li>
            <li><strong>Voluntary Demographics:</strong> Any demographic data provided (such as age group or gender) is strictly voluntary. It is stored alongside your anonymous hash solely for the purpose of analyzing statistical trends in human behavior.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">2. Data Processing & Visibility</h2>
          <p>
            The data we collect is processed in real-time to update the global counter and populate the public activity feed. 
            Only non-identifying information (such as action direction, action type, and country code) is made visible on the public feed. 
            We do not sell, rent, or distribute your behavioral data to third-party advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">3. Paid Actions & Refund Policy</h2>
          <p>
            Users may choose to participate in "Powerful Impact" actions by paying a designated fee. By submitting a payment, you acknowledge and agree to the following:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All transactions are final. Because payments immediately affect the live global counter and the public feed state, <strong>we cannot issue refunds under any circumstances</strong>.</li>
            <li>You are paying for the immediate digital execution of the action (+1.00 or -1.00) and the visual highlight on the activity feed.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black">4. General Usage</h2>
          <p>
            Countt is provided "as-is". We reserve the right to modify the counter's value, block malicious actors, or terminate the experiment if we detect automated botting, abuse, or attempts to compromise the system's security.
          </p>
        </section>

      </div>
    </main>
  );
}
EOF

# 5. דחיפה לגיטהאב
git add .
git commit -m "Add top Navbar and populate About and Terms pages"
git push

echo "✅ Navbar, About, and Terms pages have been deployed!"
