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
