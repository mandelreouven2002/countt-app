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
