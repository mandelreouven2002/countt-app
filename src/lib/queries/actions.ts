import { pool } from "@/lib/db";

type CreateFreeActionInput = {
  ipHash: string;
  direction: "add" | "sub";
  consentVersion: string;
  ageGroup?: string;
  gender?: string;
  countryCode?: string | null;
};

export async function createFreeAction(input: CreateFreeActionInput) {
  const client = await pool.connect();
  const delta = input.direction === "add" ? 0.25 : -0.25;

  try {
    await client.query("begin");

    const participantQuery = `
      INSERT INTO participants (ip_hash, consent_version, age_group, gender, country_code) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT DO NOTHING
      RETURNING id;
    `;
    let participantId;
    const res = await client.query(participantQuery, [
      input.ipHash, 
      input.consentVersion,
      input.ageGroup || null,
      input.gender || null,
      input.countryCode || null
    ]);
    
    if (res.rows.length > 0) {
      participantId = res.rows[0].id;
    } else {
      const existing = await client.query('SELECT id FROM participants WHERE ip_hash = $1', [input.ipHash]);
      participantId = existing.rows[0].id;
      
      await client.query(
        'UPDATE participants SET age_group = COALESCE(age_group, $2), gender = COALESCE(gender, $3), country_code = COALESCE(country_code, $4) WHERE id = $1',
        [participantId, input.ageGroup || null, input.gender || null, input.countryCode || null]
      );
    }

    // בדיקת 24 שעות - נבדוק מתי הייתה הלחיצה החינמית האחרונה של המשתמש הזה
    const lastActionRes = await client.query(
      `SELECT created_at FROM actions WHERE participant_id = $1 AND kind = 'free' ORDER BY created_at DESC LIMIT 1`,
      [participantId]
    );

    if (lastActionRes.rows.length > 0) {
      const lastTime = new Date(lastActionRes.rows[0].created_at).getTime();
      if ((Date.now() - lastTime) < 24 * 60 * 60 * 1000) {
        const e: any = new Error("Free click already used in the last 24 hours");
        e.code = "FREE_ALREADY_CLAIMED";
        throw e;
      }
    }

    // עוקפים את חסימת המערכת הישנה: מוחקים את ההצבעה הקודמת בטבלת free_claims ויוצרים חדשה
    await client.query(`DELETE FROM free_claims WHERE ip_hash = $1`, [input.ipHash]);
    await client.query(
      `INSERT INTO free_claims (ip_hash, participant_id, action_direction, amount) VALUES ($1, $2, $3, $4)`,
      [input.ipHash, participantId, input.direction, 0.25]
    );

    await client.query(
      `INSERT INTO actions (participant_id, kind, direction, amount, effective_delta) VALUES ($1, 'free', $2, 0.25, $3)`,
      [participantId, input.direction, delta]
    );

    const updateResult = await client.query(
      `UPDATE counter_state
       SET
         current_value = current_value + $1,
         total_add_value = total_add_value + CASE WHEN $1 > 0 THEN $1 ELSE 0 END,
         total_sub_value = total_sub_value + CASE WHEN $1 < 0 THEN ABS($1) ELSE 0 END,
         free_actions_count = free_actions_count + 1,
         updated_at = now()
       WHERE id = 1
       RETURNING current_value, updated_at`,
      [delta]
    );

    await client.query("commit");

    return {
      counter: Number(updateResult.rows[0].current_value),
      updatedAt: new Date(updateResult.rows[0].updated_at).toISOString(),
      delta,
      direction: input.direction,
    };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
