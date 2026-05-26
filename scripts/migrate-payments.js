const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// קריאה ידנית עדינה של קובץ ה-.env למקרה שמריצים לוקאלית
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^DATABASE_URL=["']?(.+?)["']?$/m);
    if (match) databaseUrl = match[1];
  }
}

if (!databaseUrl) {
  console.error("❌ Error: DATABASE_URL not found in environment or .env file.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log("⏳ Modifying 'actions' table to ensure payment idempotency...");
    
    // הוספת עמודה לזיהוי סשן התשלום של סטרייפ
    await client.query(`
      ALTER TABLE actions ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255);
    `);

    // יצירת אינדקס ייחודי חלקי - מאפשר הרבה ערכי NULL (עבור פעולות חינמיות) אבל אוכף ייחודיות מוחלטת על ערכים קיימים (תשלומים)
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_actions_stripe_session_id 
      ON actions(stripe_session_id) 
      WHERE stripe_session_id IS NOT NULL;
    `);

    console.log("✅ Database migration completed successfully!");
  } catch (err) {
    console.error("❌ Database migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
