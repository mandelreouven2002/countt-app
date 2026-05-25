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
