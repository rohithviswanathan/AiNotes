const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database.");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        "createdAt" TEXT NOT NULL
      )
    `);

    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Database initialization failed:", err.message);
  }
};

initializeDatabase();

const db = {
  all: async (query, params, callback) => {
    try {
      const result = await pool.query(
        `SELECT * FROM notes ORDER BY "createdAt" DESC`,
        []
      );

      callback(null, result.rows);
    } catch (err) {
      callback(err);
    }
  },

  get: async (query, params, callback) => {
    try {
      const result = await pool.query(
        `SELECT * FROM notes WHERE id = $1`,
        [params[0]]
      );

      callback(null, result.rows[0]);
    } catch (err) {
      callback(err);
    }
  },

  run: async (query, params, callback) => {
    try {
      if (query.includes("INSERT INTO notes")) {
        await pool.query(
          `INSERT INTO notes (id, title, content, "createdAt")
           VALUES ($1, $2, $3, $4)`,
          params
        );
      } else if (query.includes("UPDATE notes")) {
        await pool.query(
          `UPDATE notes
           SET title = $1, content = $2
           WHERE id = $3`,
          params
        );
      } else if (query.includes("DELETE FROM notes")) {
        await pool.query(
          `DELETE FROM notes WHERE id = $1`,
          [params[0]]
        );
      }

      callback(null);
    } catch (err) {
      callback(err);
    }
  },
};

module.exports = db;