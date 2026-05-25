import { pool } from "@/lib/db";

export type PublicState = {
  currentValue: number;
  freeActionsCount: number;
  paidActionsCount: number;
  totalRevenueUsd: number;
  updatedAt: string;
};

export type FeedItem = {
  id: string;
  direction: "add" | "sub";
  amount: number;
  kind: "free" | "paid";
  countryCode: string | null;
  createdAt: string;
};

export async function getPublicState(): Promise<PublicState> {
  const result = await pool.query(`SELECT * FROM counter_state WHERE id = 1 LIMIT 1`);

  if (result.rowCount === 0) {
    return {
      currentValue: 0,
      freeActionsCount: 0,
      paidActionsCount: 0,
      totalRevenueUsd: 0,
      updatedAt: new Date().toISOString()
    };
  }

  const row = result.rows[0];

  return {
    currentValue: Number(row.current_value),
    freeActionsCount: Number(row.free_actions_count),
    paidActionsCount: Number(row.paid_actions_count),
    totalRevenueUsd: Number(row.total_revenue_usd),
    updatedAt: new Date(row.updated_at || new Date()).toISOString(),
  };
}

export async function getRecentFeed(limit = 20): Promise<FeedItem[]> {
  const result = await pool.query(
    `
    SELECT a.id, a.direction, a.amount, a.kind, a.created_at, 
           (SELECT country_code FROM participants p WHERE p.id = a.participant_id) as country_code
    FROM actions a
    ORDER BY a.created_at DESC
    LIMIT $1
    `,
    [limit]
  );

  return result.rows.map((row) => ({
    id: row.id.toString(),
    direction: row.direction,
    amount: Number(row.amount),
    kind: row.kind,
    countryCode: row.country_code ?? null,
    createdAt: new Date(row.created_at).toISOString(),
  }));
}
