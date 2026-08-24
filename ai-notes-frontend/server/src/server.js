require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./database");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// ── Auth middleware ──────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ── Health ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("AI Notes backend is running 🚀"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ── Auth routes ──────────────────────────────────────────────────────────────
app.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await pool.query(
      `INSERT INTO users (id, email, password, "createdAt") VALUES ($1, $2, $3, $4)`,
      [id, email, hashed, createdAt]
    );

    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Notes routes (authenticated) ─────────────────────────────────────────────
app.get("/notes", authenticate, async (req, res) => {
  try {
    const isAdmin = req.user.email === ADMIN_EMAIL;
    const result = isAdmin
      ? await pool.query(`SELECT * FROM notes ORDER BY "createdAt" DESC`)
      : await pool.query(`SELECT * FROM notes WHERE user_id = $1 ORDER BY "createdAt" DESC`, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/notes/:id", authenticate, async (req, res) => {
  try {
    const isAdmin = req.user.email === ADMIN_EMAIL;
    const result = isAdmin
      ? await pool.query(`SELECT * FROM notes WHERE id = $1`, [req.params.id])
      : await pool.query(`SELECT * FROM notes WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/notes", authenticate, async (req, res) => {
  const { id, title, content, createdAt } = req.body;
  try {
    await pool.query(
      `INSERT INTO notes (id, title, content, "createdAt", user_id) VALUES ($1, $2, $3, $4, $5)`,
      [id, title, content, createdAt, req.user.id]
    );
    res.status(201).json({ message: "Note created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/notes/:id", authenticate, async (req, res) => {
  const { title, content } = req.body;
  try {
    const isAdmin = req.user.email === ADMIN_EMAIL;
    const result = isAdmin
      ? await pool.query(`UPDATE notes SET title=$1, content=$2 WHERE id=$3 RETURNING id`, [title, content, req.params.id])
      : await pool.query(`UPDATE notes SET title=$1, content=$2 WHERE id=$3 AND user_id=$4 RETURNING id`, [title, content, req.params.id, req.user.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Note updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/notes/:id", authenticate, async (req, res) => {
  try {
    const isAdmin = req.user.email === ADMIN_EMAIL;
    const result = isAdmin
      ? await pool.query(`DELETE FROM notes WHERE id=$1 RETURNING id`, [req.params.id])
      : await pool.query(`DELETE FROM notes WHERE id=$1 AND user_id=$2 RETURNING id`, [req.params.id, req.user.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── AI route (authenticated) ──────────────────────────────────────────────────
const PROMPTS = {
  summarize: (c) => `Summarize the following note concisely. Return only the summary:\n\n${c}`,
  rewrite: (c) => `Rewrite the following note more clearly and concisely and correct any errors. Return only the rewritten text:\n\n${c}`,
  improve: (c) => `Improve the grammar, style, and clarity of the following note. Return only the improved text:\n\n${c}`,
  translate: (c, lang = "Hindi") => `Translate the following note to ${lang}. Return only the translated text:\n\n${c}`,
  generateTitle: (c) => `Generate a short, descriptive title (max 8 words) for the following note. Return only the title, no quotes:\n\n${c}`,
  enhance: (c) => `Enhance the following note by expanding ideas, adding relevant details, and making it more comprehensive. Return only the enhanced text:\n\n${c}`,
};

app.post("/ai", authenticate, async (req, res) => {
  const { action, content, language } = req.body;
  if (!PROMPTS[action]) return res.status(400).json({ error: "Invalid action" });
  if (!content?.trim()) return res.status(400).json({ error: "Note content is empty" });

  try {
    const result = await model.generateContent(PROMPTS[action](content, language));
    res.json({ result: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
