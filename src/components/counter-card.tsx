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
  // חישוב סך כל הפעולות (חינמיות + בתשלום)
  const totalActions = freeActionsCount + paidActionsCount;

  return (
    <section className="py-4 text-center">
      {/* תצוגת המונה המרכזי ללא רקע לבן, ממורכז עם תוספת הפעולות לידו */}
      <div className="flex flex-row items-baseline justify-center gap-3">
        <span className="text-7xl md:text-8xl font-black tracking-tighter select-none">
          {currentValue.toFixed(2)}
        </span>
        <span className="text-sm md:text-base font-semibold text-black/40 whitespace-nowrap">
          by {totalActions} actions
        </span>
      </div>

      {/* נתונים משניים בעיצוב מינימליסטי ונקי, ללא כרטיסים לבנים */}
      <div className="mt-8 grid grid-cols-3 gap-2 max-w-sm mx-auto border-t border-black/5 pt-6 text-sm font-medium">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-black/30">Free Actions</div>
          <div className="mt-1 text-xl font-bold text-black/80">{freeActionsCount}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-black/30">Paid Actions</div>
          <div className="mt-1 text-xl font-bold text-black/80">{paidActionsCount}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-black/30">Revenue</div>
          <div className="mt-1 text-xl font-bold text-black/80">${totalRevenueUsd.toFixed(2)}</div>
        </div>
      </div>
    </section>
  );
}
