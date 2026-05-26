import { notFound } from "next/navigation";
import { getAnalyticsData } from "@/lib/queries/analytics";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function AdminAnalyticsPage({ searchParams }: Props) {
  const { token } = await searchParams;

  // הגנה קשוחה: אם ה-Token לא תואם למפתח הסודי בשרת - מציגים עמוד 404 (כאילו הדף לא קיים)
  if (!token || token !== process.env.ADMIN_SECRET) {
    notFound();
  }

  const data = await getAnalyticsData();
  
  // פונקציית עזר לחישוב אחוזים עבור הגרפים הוויזואליים
  const getMax = (arr: { value: number }[]) => Math.max(...arr.map(o => o.value), 1);
  const maxTrend = getMax(data.hourlyTrend);
  const maxCountry = getMax(data.countries);

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-12 font-sans space-y-10" dir="ltr">
      {/* כותרת הדשבורד */}
      <div className="border-b border-black/5 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">System Analytics</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Real-time behavioral experiment indicators</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider animate-pulse">
          Live Backend Connected
        </span>
      </div>

      {/* 4 כרטיסי KPIs עליונים */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Volume</div>
          <div className="mt-2 text-3xl font-black">{data.metrics.totalActions}</div>
          <div className="text-xs text-gray-400 mt-1">{data.metrics.freeActions} free · {data.metrics.paidActions} paid</div>
        </div>

        <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unique Participants</div>
          <div className="mt-2 text-3xl font-black">{data.metrics.totalParticipants}</div>
          <div className="text-xs text-gray-400 mt-1">Cryptographic hashes stored</div>
        </div>

        <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Revenue</div>
          <div className="mt-2 text-3xl font-black text-blue-600">${data.metrics.totalRevenue.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">Targeted for cultural donation</div>
        </div>

        <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Asset State</div>
          <div className="mt-2 text-3xl font-black tracking-tight text-gray-800">{data.metrics.currentValue.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">Global equilibrium point</div>
        </div>
      </div>

      {/* גרף מהירות לחיצות ב-24 שעות האחרונות (HTML/CSS Pure Bars) */}
      <div className="bg-white border border-black/5 rounded-[2rem] p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-800">24-Hour Interaction Velocity</h3>
        {data.hourlyTrend.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No interactions recorded in the last 24 hours.</p>
        ) : (
          <div className="flex items-end justify-between gap-2 pt-10 h-32 border-b border-black/5 px-2">
            {data.hourlyTrend.map((h, i) => {
              const heightPct = (h.value / maxTrend) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip מתוחכם שעולה בריחופים */}
                  <div className="absolute -top-10 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow">
                    {h.value} clicks
                  </div>
                  <div 
                    style={{ height: `${Math.max(heightPct, 6)}%` }}
                    className="w-full bg-gray-900 rounded-t-md group-hover:bg-blue-600 transition-colors cursor-pointer"
                  ></div>
                  <span className="text-[10px] font-bold text-gray-400 select-none">{h.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* פילוחים דמוגרפיים וגאוגרפיים בתחתית */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* דירוג מדינות */}
        <div className="bg-white border border-black/5 rounded-[2rem] p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-800">Top Geographic Hotspots</h3>
          <div className="space-y-4">
            {data.countries.map((c, i) => {
              const widthPct = (c.value / maxCountry) * 100;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm font-semibold text-gray-700">
                    <span>{c.label === 'IL' ? '🇮🇱 Israel (IL)' : `🌎 ${c.label}`}</span>
                    <span className="text-gray-400">{c.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div style={{ width: `${widthPct}%` }} className="bg-gray-800 h-full rounded-full"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* פילוח גיל ומגדר (מבנה טבלאי מינימליסטי) */}
        <div className="space-y-6">
          {/* גילאים */}
          <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Age Distribution</h3>
            <div className="divide-y divide-black/5">
              {data.ageGroups.map((g, i) => (
                <div key={i} className="flex justify-between py-2.5 text-sm font-semibold">
                  <span className="text-gray-700">{g.label}</span>
                  <span className="text-gray-900">{g.value} users</span>
                </div>
              ))}
            </div>
          </div>

          {/* מגדר */}
          <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Gender Metrics</h3>
            <div className="divide-y divide-black/5">
              {data.genders.map((g, i) => (
                <div key={i} className="flex justify-between py-2.5 text-sm font-semibold">
                  <span className="text-gray-700 capitalize">{g.label}</span>
                  <span className="text-gray-900">{g.value} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
