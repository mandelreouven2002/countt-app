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
