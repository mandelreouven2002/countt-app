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
    <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold tracking-wide text-black/40 mb-2 uppercase">Global Counter</p>
      <div className="text-7xl font-black tracking-tighter">
        {currentValue.toFixed(2)}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gray-50 p-5">
          <div className="text-sm font-medium text-gray-500">Free actions</div>
          <div className="mt-1 text-3xl font-bold">{freeActionsCount}</div>
        </div>
        <div className="rounded-2xl bg-gray-50 p-5">
          <div className="text-sm font-medium text-gray-500">Paid actions</div>
          <div className="mt-1 text-3xl font-bold">{paidActionsCount}</div>
        </div>
        <div className="rounded-2xl bg-gray-50 p-5">
          <div className="text-sm font-medium text-gray-500">Revenue</div>
          <div className="mt-1 text-3xl font-bold">${totalRevenueUsd.toFixed(2)}</div>
        </div>
      </div>
    </section>
  );
}
