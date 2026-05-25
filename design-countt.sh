#!/usr/bin/env bash
set -euo pipefail

echo "==> Reverting to International English LTR UI..."

# 1. דף תנאים באנגלית
cat > src/app/terms/page.tsx <<'EOF'
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl p-10 font-sans" dir="ltr">
      <h1 className="text-3xl font-bold mb-6">Terms of Service & Privacy Policy</h1>
      <p className="text-lg text-gray-700 leading-relaxed">
        This is a placeholder text. 
        Later on, we will add all the relevant legal information regarding data collection, 
        the purpose of this social experiment, and how we handle the optional demographic data provided.
      </p>
      <a href="/" className="inline-block mt-8 text-blue-600 hover:underline">
        &larr; Back to home
      </a>
    </main>
  );
}
EOF

# 2. ה-Layout חזרה לאנגלית ולפונט Inter
cat > src/app/layout.tsx <<'EOF'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.className} bg-[#f7f7f5] text-[#111111] antialiased`}>
        {children}
      </body>
    </html>
  );
}
EOF

# 3. חלונית ההשפעה (Modal) - באנגלית בלבד
cat > src/components/influence-controls.tsx <<'EOF'
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

type FeedItem = {
  id: string;
  direction: "add" | "sub";
  amount: number;
  kind: "free" | "paid";
  countryCode: string | null;
  createdAt: string;
};

type Props = {
  onLocalAction?: (item: FeedItem, nextCounter: number) => void;
};

export default function InfluenceControls({ onLocalAction }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [direction, setDirection] = useState<"add" | "sub" | null>(null);
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [consent, setConsent] = useState(false);

  function resetAndOpen() {
    setStep(1);
    setDirection(null);
    setAgeGroup("");
    setGender("");
    setConsent(false);
    setError(null);
    setIsOpen(true);
  }

  function handleContinue() {
    if (!direction || !consent) {
      setError("Please select a direction and accept the terms.");
      return;
    }
    setError(null);
    setStep(2);
  }

  async function executeFreeAction() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/actions/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direction,
          consent: true,
          consentVersion: process.env.NEXT_PUBLIC_CONSENT_VERSION || "v1",
          ageGroup: ageGroup || undefined,
          gender: gender || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Action failed, please try again.");
        return;
      }

      onLocalAction?.(
        {
          id: Math.random().toString(36).substring(7),
          direction: direction as "add" | "sub",
          amount: 0.25,
          kind: "free",
          countryCode: null,
          createdAt: new Date().toISOString(),
        },
        Number(data.counter)
      );
      
      setIsOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={resetAndOpen}
        className="w-full rounded-full bg-black text-white text-xl font-bold py-5 px-8 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
      >
        Make an Impact
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors text-xl font-bold"
            >
              ✕
            </button>

            {step === 1 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">How do you want to influence?</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDirection("add")}
                    className={`p-4 rounded-2xl border-2 text-lg font-bold transition-all ${
                      direction === "add" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:border-green-200"
                    }`}
                  >
                    + Add
                  </button>
                  <button
                    onClick={() => setDirection("sub")}
                    className={`p-4 rounded-2xl border-2 text-lg font-bold transition-all ${
                      direction === "sub" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    - Subtract
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Age Group (Optional)</label>
                    <select 
                      value={ageGroup} 
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-black outline-none appearance-none"
                    >
                      <option value="">Select age</option>
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                      <option value="45+">45+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Gender (Optional)</label>
                    <select 
                      value={gender} 
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-black outline-none appearance-none"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                  <input 
                    type="checkbox" 
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600 leading-tight cursor-pointer">
                    I agree to the <Link href="/terms" target="_blank" className="text-black underline font-medium">Terms & Privacy Policy</Link>, 
                    and consent to my data being used for this experiment.
                  </label>
                </div>

                {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

                <button
                  onClick={handleContinue}
                  disabled={!direction || !consent}
                  className="w-full rounded-full bg-black text-white font-bold py-4 mt-2 disabled:opacity-30 transition-all"
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-6">Choose Your Path</h2>
                
                <div className="space-y-4">
                  {/* Free Option */}
                  <div className="p-5 rounded-2xl border-2 border-gray-900 bg-white shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Standard Impact</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold">Free</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Change the global counter by {direction === "add" ? "+0.25" : "-0.25"} (One-time action).
                    </p>
                    <button
                      onClick={executeFreeAction}
                      disabled={isPending}
                      className="w-full rounded-full bg-black text-white font-bold py-3 hover:bg-gray-800 disabled:opacity-50 transition-all"
                    >
                      {isPending ? "Applying..." : "Make Impact"}
                    </button>
                  </div>

                  {/* Paid Option */}
                  <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col gap-4 opacity-75">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-700">Powerful Impact</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">$1.00</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Change the global counter by {direction === "add" ? "+1.00" : "-1.00"} and get a highlighted feed mention.
                    </p>
                    <button
                      disabled
                      className="w-full rounded-full bg-gray-200 text-gray-500 font-bold py-3 cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(1)}
                  className="w-full text-sm font-medium text-gray-500 hover:text-black mt-4"
                >
                  &larr; Go back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
EOF

# 4. כרטיס המונה באנגלית
cat > src/components/counter-card.tsx <<'EOF'
type Props = {
  currentValue: number;
  freeActionsCount: number;
  paidActionsCount: number;
  totalRevenueUsd: number;
};

export default function CounterCard({
  currentValue,
  freeActionsCount,
  paidActionsCount,
  totalRevenueUsd,
}: Props) {
  return (
    <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold tracking-wide text-black/40 mb-2 uppercase">Global Counter</p>
      <div className="text-7xl font-black tracking-tighter">
        {currentValue.toFixed(2)}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gray-50 p-5">
          <div className="text-sm font-medium text-gray-500">Free actions</div>
          <div className="mt-1 text-3xl font-bold">{freeActionsCount}</div>
        </div>
        <div className="rounded-2xl bg-gray-50 p-5">
          <div className="text-sm font-medium text-gray-500">Paid actions</div>
          <div className="mt-1 text-3xl font-bold">{paidActionsCount}</div>
        </div>
        <div className="rounded-2xl bg-gray-50 p-5">
          <div className="text-sm font-medium text-gray-500">Revenue</div>
          <div className="mt-1 text-3xl font-bold">${totalRevenueUsd.toFixed(2)}</div>
        </div>
      </div>
    </section>
  );
}
EOF

# 5. הפיד באנגלית
cat > src/components/activity-feed.tsx <<'EOF'
type FeedItem = {
  id: string;
  direction: "add" | "sub";
  amount: number;
  kind: "free" | "paid";
  countryCode: string | null;
  createdAt: string;
};

export default function ActivityFeed({ items }: { items: FeedItem[] }) {
  return (
    <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Recent activity</h2>

      <ul className="space-y-3">
        {items.length === 0 ? (
          <li className="text-sm text-gray-500">No activity yet. Be the first!</li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-4"
            >
              <span className="font-medium text-gray-700 capitalize">
                {item.countryCode ?? "🌎"} · {item.kind} · 
                <span className={item.direction === 'add' ? 'text-green-600 font-bold mx-1' : 'text-red-600 font-bold mx-1'}>
                  {item.direction === 'add' ? '+' : '-'}{item.amount.toFixed(2)}
                </span>
              </span>
              <span className="text-sm text-gray-400 font-medium">
                {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
EOF

# 6. עמוד הבית (Shell) באנגלית
cat > src/components/home-shell.tsx <<'EOF'
"use client";

import { useState } from "react";
import CounterCard from "@/components/counter-card";
import InfluenceControls from "@/components/influence-controls";
import ActivityFeed from "@/components/activity-feed";

type FeedItem = {
  id: string;
  direction: "add" | "sub";
  amount: number;
  kind: "free" | "paid";
  countryCode: string | null;
  createdAt: string;
};

type Props = {
  initialState: {
    currentValue: number;
    freeActionsCount: number;
    paidActionsCount: number;
    totalRevenueUsd: number;
  };
  initialFeed: FeedItem[];
};

export default function HomeShell({ initialState, initialFeed }: Props) {
  const [counter, setCounter] = useState(initialState.currentValue);
  const [feed, setFeed] = useState(initialFeed);
  const [freeActionsCount, setFreeActionsCount] = useState(initialState.freeActionsCount);

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-12 font-sans">
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-bold text-gray-600 shadow-sm mb-4">
          Countt · Social Experiment
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
          One global number.<br/>Everyone can move it.
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 font-medium leading-relaxed">
          Choose to add or subtract. Every action, free or paid, 
          shapes our shared outcome in real-time.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <CounterCard
            currentValue={counter}
            freeActionsCount={freeActionsCount}
            paidActionsCount={initialState.paidActionsCount}
            totalRevenueUsd={initialState.totalRevenueUsd}
          />

          <InfluenceControls
            onLocalAction={(item, nextCounter) => {
              setCounter(nextCounter);
              setFreeActionsCount((n) => n + 1);
              setFeed((prev) => [item, ...prev].slice(0, 20));
            }}
          />
        </div>

        <ActivityFeed items={feed} />
      </div>
    </main>
  );
}
EOF

git add .
git commit -m "Revert UI to International English (LTR) and Inter font"
git push

echo "✅ The International English UI has been pushed to GitHub!"
