"use client";

import { useState } from "react";
import CounterCard from "@/components/counter-card";
import FreeClickControls from "@/components/free-click-controls";
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
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <div className="mb-8">
        <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 shadow-sm">
          Countt · Social Experiment
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">One global number. Everyone can move it.</h1>
        <p className="mt-3 max-w-2xl text-black/65 text-lg">
          Add or subtract 0.25 once for free. Every action changes the shared counter for everyone.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <CounterCard
            currentValue={counter}
            freeActionsCount={freeActionsCount}
            paidActionsCount={initialState.paidActionsCount}
            totalRevenueUsd={initialState.totalRevenueUsd}
          />

          <FreeClickControls
            initialCounter={counter}
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
