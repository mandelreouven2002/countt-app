"use client";

import { useState, useTransition } from "react";

type FeedItem = {
  id: string;
  direction: "add" | "sub";
  amount: number;
  kind: "free" | "paid";
  countryCode: string | null;
  createdAt: string;
};

type Props = {
  initialCounter: number;
  onLocalAction?: (item: FeedItem, nextCounter: number) => void;
};

export default function FreeClickControls({ initialCounter, onLocalAction }: Props) {
  const [counter, setCounter] = useState(initialCounter);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function submit(direction: "add" | "sub") {
    setMessage(null);

    startTransition(async () => {
      const res = await fetch("/api/actions/free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          direction,
          consent: true,
          consentVersion: process.env.NEXT_PUBLIC_CONSENT_VERSION || "v1",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error ?? "Request failed");
        return;
      }

      const nextCounter = Number(data.counter);
      setCounter(nextCounter);
      setMessage(direction === "add" ? "Added 0.25" : "Subtracted 0.25");

      onLocalAction?.(
        {
          id: Math.random().toString(36).substring(7),
          direction,
          amount: 0.25,
          kind: "free",
          countryCode: null,
          createdAt: new Date().toISOString(),
        },
        nextCounter
      );
    });
  }

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-wide text-black/60">Your free move</p>
      <div className="mt-3 text-4xl font-bold">{counter.toFixed(2)}</div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => submit("add")}
          disabled={isPending}
          className="rounded-2xl border border-black/10 px-5 py-3 font-medium hover:bg-black/5 disabled:opacity-50"
        >
          +0.25
        </button>

        <button
          onClick={() => submit("sub")}
          disabled={isPending}
          className="rounded-2xl border border-black/10 px-5 py-3 font-medium hover:bg-black/5 disabled:opacity-50"
        >
          -0.25
        </button>
      </div>

      {message ? <p className="mt-4 text-sm font-semibold text-black/70">{message}</p> : null}
    </section>
  );
}
