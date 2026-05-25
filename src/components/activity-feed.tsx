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
