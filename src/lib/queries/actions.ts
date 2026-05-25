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

    // עכשיו אנחנו שומרים גם את הגיל, המגדר והמדינה!
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
      // אם המשתמש כבר קיים בטבלה, נשלוף את ה-ID שלו
      const existing = await client.query('SELECT id FROM participants WHERE ip_hash = $1', [input.ipHash]);
      participantId = existing.rows[0].id;
      
      // ונעדכן את הפרטים שלו אם הם היו ריקים בפעם הקודמת
      await client.query(
        'UPDATE participants SET age_group = COALESCE(age_group, $2), gender = COALESCE(gender, $3), country_code = COALESCE(country_code, $4) WHERE id = $1',
        [participantId, input.ageGroup || null, input.gender || null, input.countryCode || null]
      );
    }

    try {
      await client.query(
        `INSERT INTO free_claims (ip_hash, participant_id, action_direction, amount) VALUES ($1, $2, $3, $4)`,
        [input.ipHash, participantId, input.direction, 0.25]
      );
    } catch (error: any) {
      if (error?.code === "23505") {
        const e: any = new Error("Free click already claimed");
        e.code = "FREE_ALREADY_CLAIMED";
        throw e;
      }
      throw error;
    }

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
