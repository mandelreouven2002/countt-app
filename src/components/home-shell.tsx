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
