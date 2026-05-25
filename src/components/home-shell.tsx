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
    <main className="mx-auto max-w-2xl p-6 md:p-12 font-sans text-center space-y-12">
      {/* כותרת מרכזית */}
      <div className="space-y-4">
        <div className="inline-flex rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-bold text-gray-600 shadow-sm">
          Countt · Social Experiment
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
          One global number.<br/>Everyone can move it.
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500 font-medium leading-relaxed">
          Choose to add or subtract. Every action, free or paid, 
          shapes our shared outcome in real-time.
        </p>
      </div>

      {/* אזור אינטראקטיבי מרכזי */}
      <div className="space-y-8 max-w-xl mx-auto">
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

      {/* חלק חדש: על הפרויקט (About Section) ממוקם בדיוק לפני הפיד */}
      <section className="space-y-4 max-w-xl mx-auto pt-12 border-t border-black/5 text-center">
        <h2 className="text-2xl font-black tracking-tight text-black/80">About the Project</h2>
        <p className="text-gray-500 font-medium leading-relaxed text-base">
          Countt is an open-ended digital collective experiment designed to observe human coordination, synchronization, 
          and momentum in real time. By tracking how web users interact with a single, un-capped asset, 
          the platform maps the continuous tug-of-war between constructive behaviors and chaotic intervention.
        </p>
        <p className="text-sm font-bold tracking-wide text-blue-600/70 bg-blue-50/40 inline-block px-4 py-1.5 rounded-full border border-blue-100/30">
          Founded by an Information Systems Engineering student at the Technion
        </p>
      </section>

      {/* היסטוריית פעולות (הפיד הנקי) בחלק התחתון */}
      <div className="max-w-xl mx-auto pt-4">
        <ActivityFeed items={feed} />
      </div>
    </main>
  );
}
