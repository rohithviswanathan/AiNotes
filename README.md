# AI Notes

A full-stack, AI-powered note-taking app built with React + TypeScript on the frontend and Node.js + Express on the backend. Notes are persisted in a PostgreSQL database, and all AI features are powered by Google Gemini.

---

## Features

- Create, edit, and delete notes
- Auto-save with debounce (saves 600ms after you stop typing)
- Search notes by title or content from the navbar
- Responsive layout — sidebar collapses into a drawer on mobile

### AI Toolbar (per note)

| Action | What it does |
|---|---|
| Summarize | Generates a concise summary shown in a result panel |
| Rewrite | Rewrites the note more clearly; shows a preview before applying |
| Improve | Improves grammar, style, and clarity; shows a preview before applying |
| Translate | Asks for a target language, then translates the note into it |
| Generate Title | Suggests a short title; shows a preview before applying |
| Enhance | Expands ideas and adds detail; shows a preview before applying |

Rewrite, Improve, Generate Title, and Enhance show an **Approve / Discard** preview before modifying the note. Summarize and Translate display results in a read-only panel with a copy button.

---

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Material UI (MUI v9)

### Backend
- Node.js + Express 5
- PostgreSQL (via `pg` connection pool)
- Google Gemini API (`gemini-3.5-flash-lite`) via `@google/generative-ai`
- `dotenv` for environment config
- `nodemon` for development

---

## Project Structure

```
ainotes/
└── ai-notes-frontend/
    ├── src/                        # React frontend
    │   ├── api/
    │   │   ├── ai.ts               # callAi() — calls /ai endpoint
    │   │   └── notes.ts            # CRUD calls to /notes endpoint
    │   ├── components/
    │   │   ├── editor/
    │   │   │   ├── Editor.tsx      # Main note editor + AI toolbar
    │   │   │   └── EmptyState.tsx  # Shown when no note is selected
    │   │   ├── layout/
    │   │   │   ├── MainLayout.tsx  # Two-column layout (sidebar + editor)
    │   │   │   └── Navbar.tsx      # Top bar with search and new note button
    │   │   ├── sidebar/
    │   │   │   ├── SideBar.tsx     # Note list panel
    │   │   │   └── NoteItem.tsx    # Individual note list item
    │   │   └── common/
    │   │       └── SearchBar.tsx
    │   ├── App.tsx                 # Root component, state management
    │   ├── types.ts                # Note type definition
    │   └── main.tsx
    └── server/
        ├── src/
        │   ├── server.js           # Express app, REST + /ai routes
        │   └── database.js         # PostgreSQL pool + db helper
        ├── .env                    # Environment variables (not committed)
        └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- A PostgreSQL database (local or hosted, e.g. Neon, Supabase, Railway)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone the repo

```bash
git clone <repo-url>
cd ainotes/ai-notes-frontend
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_postgresql_connection_string_here
```

Start the backend:

```bash
npm run dev      # development (nodemon)
npm start        # production
```

The server runs on `http://localhost:5000`.

### 3. Set up the frontend

```bash
cd ..            # back to ai-notes-frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

---

## API Reference

### Notes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notes` | Get all notes (ordered by date desc) |
| GET | `/notes/:id` | Get a single note |
| POST | `/notes` | Create a note |
| PUT | `/notes/:id` | Update a note |
| DELETE | `/notes/:id` | Delete a note |

### AI

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/ai` | `{ action, content, language? }` | Run an AI action on note content |

Valid `action` values: `summarize`, `rewrite`, `improve`, `translate`, `generateTitle`, `enhance`

`language` is only used when `action` is `translate` (e.g. `"French"`, `"Hindi"`).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
