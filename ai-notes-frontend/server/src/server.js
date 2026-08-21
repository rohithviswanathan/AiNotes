require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Get all notes
app.get("/notes", (req, res) => {
  db.all(
    "SELECT * FROM notes ORDER BY createdAt DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

// Get one note
app.get("/notes/:id", (req, res) => {
  db.get(
    "SELECT * FROM notes WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(row);
    }
  );
});

// Create note
app.post("/notes", (req, res) => {
  const { id, title, content, createdAt } = req.body;

  db.run(
    `INSERT INTO notes(id,title,content,createdAt)
     VALUES(?,?,?,?)`,
    [id, title, content, createdAt],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({ message: "Note created" });
    }
  );
});

// Update note
app.put("/notes/:id", (req, res) => {
  const { title, content } = req.body;

  db.run(
    `UPDATE notes
     SET title=?, content=?
     WHERE id=?`,
    [title, content, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Note updated" });
    }
  );
});

// Delete note
app.delete("/notes/:id", (req, res) => {
  db.run(
    "DELETE FROM notes WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Note deleted" });
    }
  );
});

const PROMPTS = {
  summarize: (content) => `Summarize the following note concisely:\n\n${content}`,
  rewrite: (content) => `Rewrite the following note more clearly and concisely:\n\n${content}`,
  improve: (content) => `Improve the grammar, style, and clarity of the following note. Return only the improved text:\n\n${content}`,
  translate: (content) => `Translate the following note to English. Return only the translated text:\n\n${content}`,
  generateTitle: (content) => `Generate a short, descriptive title (max 8 words) for the following note. Return only the title, no quotes:\n\n${content}`,
};

app.post("/ai", async (req, res) => {
  const { action, content } = req.body;

  if (!PROMPTS[action]) {
    return res.status(400).json({ error: "Invalid action" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Note content is empty" });
  }

  try {
    const result = await model.generateContent(PROMPTS[action](content));
    res.json({ result: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});