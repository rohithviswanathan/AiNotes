require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("AI Notes backend is running 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Notes backend is running"
  });
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
  summarize: (content) => `Summarize the following note concisely. Return only the summary:\n\n${content}`,
  rewrite: (content) => `Rewrite the following note more clearly and concisely and correct any errors in note as well. Return only the rewritten text:\n\n${content}`,
  improve: (content) => `Improve the grammar, style, and clarity of the following note. Return only the improved text:\n\n${content}`,
  translate: (content, language = "Hindi") => `Translate the following note to ${language}. Return only the translated text:\n\n${content}`,
  generateTitle: (content) => `Generate a short, descriptive title (max 8 words) for the following note. Return only the title, no quotes:\n\n${content}`,
  enhance: (content) => `Enhance the following note by expanding ideas, adding relevant details, and making it more comprehensive. Return only the enhanced text:\n\n${content}`,
};

app.post("/ai", async (req, res) => {
  const { action, content, language } = req.body;

  if (!PROMPTS[action]) {
    return res.status(400).json({ error: "Invalid action" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Note content is empty" });
  }

  try {
    const result = await model.generateContent(PROMPTS[action](content, language));
    res.json({ result: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});