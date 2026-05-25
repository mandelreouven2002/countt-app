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
    <section className="text-center w-full">
      <h2 className="text-2xl font-black tracking-tight mb-6 text-black/80">Recent Activity</h2>

      {/* רשימה נקייה ללא קופסה לבנה, מיושרת וממורכזת על הרקע הכללי */}
      <ul className="space-y-2 max-w-md mx-auto">
        {items.length === 0 ? (
          <li className="text-sm text-gray-500 py-4">No activity yet. Be the first to make an impact!</li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-3 border-b border-black/[0.04] text-sm px-2"
            >
              <span className="font-semibold text-gray-700 capitalize">
                {item.countryCode ?? "🌎"} · {item.kind} · 
                <span className={item.direction === 'add' ? 'text-green-600 font-bold mx-1' : 'text-red-600 font-bold mx-1'}>
                  {item.direction === 'add' ? '+' : '-'}{item.amount.toFixed(2)}
                </span>
              </span>
              <span className="text-xs text-gray-400 font-bold tracking-wide">
                {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
