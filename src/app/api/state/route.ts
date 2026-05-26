import { NextResponse } from "next/server";
import { getPublicState, getRecentFeed } from "@/lib/queries/counter";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [state, feed] = await Promise.all([
      getPublicState(),
      getRecentFeed(20),
    ]);
    return NextResponse.json({ state, feed });
  } catch (error) {
    console.error("Failed to fetch live state:", error);
    return NextResponse.json(
      { error: "Failed to fetch state" },
      { status: 500 }
    );
  }
}
