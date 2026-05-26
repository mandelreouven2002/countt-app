import { pool } from "@/lib/db";

export type AnalyticsData = {
  metrics: {
    currentValue: number;
    totalActions: number;
    freeActions: number;
    paidActions: number;
    totalParticipants: number;
    totalRevenue: number;
  };
  ageGroups: { label: string; value: number }[];
  genders: { label: string; value: number }[];
  countries: { label: string; value: number }[];
  hourlyTrend: { label: string; value: number }[];
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const client = await pool.connect();

  try {
    // אגרגציה ראשונה: מדדים כלליים
    const metricsRes = await client.query(`
      SELECT 
        (SELECT current_value FROM counter_state WHERE id = 1) as current_value,
        COUNT(*) as total_actions,
        COUNT(CASE WHEN kind = 'free' THEN 1 END) as free_actions,
        COUNT(CASE WHEN kind = 'paid' THEN 1 END) as paid_actions,
        (SELECT COUNT(*) FROM participants) as total_participants,
        (SELECT total_revenue_usd FROM counter_state WHERE id = 1) as total_revenue
      FROM actions
    `);

    // אגרגציה שנייה: קבוצות גיל
    const ageRes = await client.query(`
      SELECT COALESCE(age_group, 'Not Specified') as label, COUNT(*) as value 
      FROM participants 
      GROUP BY age_group 
      ORDER BY value DESC
    `);

    // אגרגציה שלישית: מגדר
    const genderRes = await client.query(`
      SELECT COALESCE(gender, 'Not Specified') as label, COUNT(*) as value 
      FROM participants 
      GROUP BY gender 
      ORDER BY value DESC
    `);

    // אגרגציה רביעית: מדינות (טופ 10)
    const countryRes = await client.query(`
      SELECT COALESCE(country_code, 'Unknown') as label, COUNT(*) as value 
      FROM participants 
      GROUP BY country_code 
      ORDER BY value DESC 
      LIMIT 10
    `);

    // אגרגציה חמישית: מגמת פעילות ב-24 שעות האחרונות לפי שעה
    const trendRes = await client.query(`
      SELECT 
        TO_CHAR(date_trunc('hour', created_at), 'HH24:00') as label,
        COUNT(*) as value
      FROM actions
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      GROUP BY date_trunc('hour', created_at), id
      ORDER BY MIN(created_at) ASC
    `);

    const m = metricsRes.rows[0] || {};

    return {
      metrics: {
        currentValue: Number(m.current_value || 0),
        totalActions: Number(m.total_actions || 0),
        freeActions: Number(m.free_actions || 0),
        paidActions: Number(m.paid_actions || 0),
        totalParticipants: Number(m.total_participants || 0),
        totalRevenue: Number(m.total_revenue || 0),
      },
      ageGroups: ageRes.rows.map(r => ({ label: r.label, value: Number(r.value) })),
      genders: genderRes.rows.map(r => ({ label: r.label, value: Number(r.value) })),
      countries: countryRes.rows.map(r => ({ label: r.label.toUpperCase(), value: Number(r.value) })),
      hourlyTrend: trendRes.rows.map(r => ({ label: r.label, value: Number(r.value) })),
    };
  } finally {
    client.release();
  }
}
