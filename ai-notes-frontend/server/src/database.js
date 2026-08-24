const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => console.log("Connected to PostgreSQL database."));
pool.on("error", (err) => console.error("Unexpected PostgreSQL error:", err));

const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        "createdAt" TEXT NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        "createdAt" TEXT NOT NULL,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Add user_id column if upgrading from old schema (no-op if already exists)
    await pool.query(`
      ALTER TABLE notes ADD COLUMN IF NOT EXISTS user_id TEXT
    `).catch(() => {});

    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Database initialization failed:", err.message);
  }
};

initializeDatabase();

module.exports = pool;
