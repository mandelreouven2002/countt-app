#!/usr/bin/env bash
set -euo pipefail

echo "==> Creating directories..."
mkdir -p src/lib/queries
mkdir -p src/lib/security
mkdir -p src/components
mkdir -p src/app/api/public/state
mkdir -p src/app/api/actions/free

echo "==> Writing files..."

cat > src/lib/db.ts <<'EOF'
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export const pool =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool;
}
EOF

cat > src/lib/security/ip.ts <<'EOF'
import crypto from "node:crypto";

export function extractClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return null;
}

export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) {
    throw new Error("Missing IP_HASH_SECRET");
  }
  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}
EOF

cat > src/lib/queries/counter.ts <<'EOF'
import { pool } from "@/lib/db";

export type PublicState = {
  currentValue: number;
  freeActionsCount: number;
  paidActionsCount: number;
  totalRevenueUsd: number;
  updatedAt: string;
};

export type FeedItem = {
  id: string;
  direction: "add" | "sub";
  amount: number;
  kind: "free" | "paid";
  countryCode: string | null;
  createdAt: string;
};

export async function getPublicState(): Promise<PublicState> {
  const result = await pool.query(`SELECT * FROM counter_state WHERE id = 1 LIMIT 1`);

  if (result.rowCount === 0) {
    return {
      currentValue: 0,
      freeActionsCount: 0,
      paidActionsCount: 0,
      totalRevenueUsd: 0,
      updatedAt: new Date().toISOString()
    };
  }

  const row = result.rows[0];

  return {
    currentValue: Number(row.current_value),
    freeActionsCount: Number(row.free_actions_count),
    paidActionsCount: Number(row.paid_actions_count),
    totalRevenueUsd: Number(row.total_revenue_usd),
    updatedAt: new Date(row.updated_at || new Date()).toISOString(),
  };
}

export async function getRecentFeed(limit = 20): Promise<FeedItem[]> {
  const result = await pool.query(
    `
    SELECT a.id, a.direction, a.amount, a.kind, a.created_at, 
           (SELECT country_code FROM participants p WHERE p.id = a.participant_id) as country_code
    FROM actions a
    ORDER BY a.created_at DESC
    LIMIT $1
    `,
    [limit]
  );

  return result.rows.map((row) => ({
    id: row.id.toString(),
    direction: row.direction,
    amount: Number(row.amount),
    kind: row.kind,
    countryCode: row.country_code ?? null,
    createdAt: new Date(row.created_at).toISOString(),
  }));
}
EOF

cat > src/lib/queries/actions.ts <<'EOF'
import { pool } from "@/lib/db";

type CreateFreeActionInput = {
  ipHash: string;
  direction: "add" | "sub";
  consentVersion: string;
  ageGroup?: string;
  gender?: string;
  countryCode?: string | null;
};

export async function createFreeAction(input: CreateFreeActionInput) {
  const client = await pool.connect();
  const delta = input.direction === "add" ? 0.25 : -0.25;

  try {
    await client.query("begin");

    const participantQuery = `
      INSERT INTO participants (ip_hash, consent_version) 
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING id;
    `;
    let participantId;
    const res = await client.query(participantQuery, [input.ipHash, input.consentVersion]);
    
    if (res.rows.length > 0) {
      participantId = res.rows[0].id;
    } else {
      const existing = await client.query('SELECT id FROM participants WHERE ip_hash = $1', [input.ipHash]);
      participantId = existing.rows[0].id;
    }

    try {
      await client.query(
        `INSERT INTO free_claims (ip_hash, participant_id, action_direction, amount) VALUES ($1, $2, $3, $4)`,
        [input.ipHash, participantId, input.direction, 0.25]
      );
    } catch (error: any) {
      if (error?.code === "23505") {
        const e: any = new Error("Free click already claimed");
        e.code = "FREE_ALREADY_CLAIMED";
        throw e;
      }
      throw error;
    }

    await client.query(
      `INSERT INTO actions (participant_id, kind, direction, amount, effective_delta) VALUES ($1, 'free', $2, 0.25, $3)`,
      [participantId, input.direction, delta]
    );

    const updateResult = await client.query(
      `UPDATE counter_state
       SET
         current_value = current_value + $1,
         total_add_value = total_add_value + CASE WHEN $1 > 0 THEN $1 ELSE 0 END,
         total_sub_value = total_sub_value + CASE WHEN $1 < 0 THEN ABS($1) ELSE 0 END,
         free_actions_count = free_actions_count + 1,
         updated_at = now()
       WHERE id = 1
       RETURNING current_value, updated_at`,
      [delta]
    );

    await client.query("commit");

    return {
      counter: Number(updateResult.rows[0].current_value),
      updatedAt: new Date(updateResult.rows[0].updated_at).toISOString(),
      delta,
      direction: input.direction,
    };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
EOF

cat > src/app/api/public/state/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { getPublicState, getRecentFeed } from "@/lib/queries/counter";

export const dynamic = "force-dynamic";

export async function GET() {
  const [state, feed] = await Promise.all([
    getPublicState(),
    getRecentFeed(20),
  ]);

  return NextResponse.json({
    state,
    feed,
  });
}
EOF

cat > src/app/api/actions/free/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { z } from "zod";
import { createFreeAction } from "@/lib/queries/actions";
import { extractClientIp, hashIp } from "@/lib/security/ip";

const bodySchema = z.object({
  direction: z.enum(["add", "sub"]),
  consent: z.literal(true),
  consentVersion: z.string().min(1),
  ageGroup: z.string().optional(),
  gender: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const clientIp = extractClientIp(request);

    if (!clientIp) {
      return NextResponse.json(
        { error: "Unable to determine client IP" },
        { status: 400 }
      );
    }

    const ipHash = hashIp(clientIp);

    const result = await createFreeAction({
      ipHash,
      direction: parsed.data.direction,
      consentVersion: parsed.data.consentVersion,
      ageGroup: parsed.data.ageGroup,
      gender: parsed.data.gender,
      countryCode: null,
    });

    return NextResponse.json({
      ok: true,
      counter: result.counter,
      delta: result.delta,
      direction: result.direction,
      updatedAt: result.updatedAt,
    });
  } catch (error: any) {
    if (error?.code === "FREE_ALREADY_CLAIMED") {
      return NextResponse.json(
        { error: "Free click already used" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
EOF

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
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-wide text-black/60">Global Counter</p>
      <div className="mt-3 text-5xl font-bold tracking-tight">
        {currentValue.toFixed(2)}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-black/[0.03] p-4">
          <div className="text-sm text-black/60">Free actions</div>
          <div className="mt-1 text-2xl font-semibold">{freeActionsCount}</div>
        </div>
        <div className="rounded-2xl bg-black/[0.03] p-4">
          <div className="text-sm text-black/60">Paid actions</div>
          <div className="mt-1 text-2xl font-semibold">{paidActionsCount}</div>
        </div>
        <div className="rounded-2xl bg-black/[0.03] p-4">
          <div className="text-sm text-black/60">Revenue</div>
          <div className="mt-1 text-2xl font-semibold">${totalRevenueUsd.toFixed(2)}</div>
        </div>
      </div>
    </section>
  );
}
EOF

cat > src/components/free-click-controls.tsx <<'EOF'
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
EOF

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
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Recent activity</h2>

      <ul className="mt-4 space-y-2">
        {items.length === 0 ? (
          <li className="text-sm text-black/60">No activity yet.</li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-2xl bg-black/[0.03] px-4 py-3 text-sm"
            >
              <span>
                {item.countryCode ?? "??"} · {item.kind} · {item.direction} · {item.amount.toFixed(2)}
              </span>
              <span className="text-black/50">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
EOF

cat > src/components/home-shell.tsx <<'EOF'
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
EOF

cat > src/app/page.tsx <<'EOF'
import HomeShell from "@/components/home-shell";
import { getPublicState, getRecentFeed } from "@/lib/queries/counter";

export const dynamic = "force-dynamic"; 

export default async function HomePage() {
  const [state, feed] = await Promise.all([
    getPublicState(),
    getRecentFeed(20),
  ]);

  return (
    <HomeShell
      initialState={state}
      initialFeed={feed}
    />
  );
}
EOF

cat > src/app/globals.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #f7f7f5;
  --foreground: #111111;
}

html, body {
  background: var(--background);
  color: var(--foreground);
}

* {
  box-sizing: border-box;
}
EOF

echo "==> Pushing to GitHub..."
git add .
git commit -m "Bootstrap Countt UI and DB architecture"
git push

echo "✅ סיימנו! הקבצים נוצרו והועלו ל-GitHub."
