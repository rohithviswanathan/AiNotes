import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import EmptyState from "./components/editor/EmptyState";
import type { Note, User } from "./types";

import Navbar from "./components/layout/Navbar";
import MainLayout from "./components/layout/MainLayout";
import Sidebar from "./components/sidebar/SideBar";
import Editor from "./components/editor/Editor";
import AuthPage from "./components/auth/AuthPage";

import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "./api/notes";

import theme from "./theme";

const SAVE_DELAY = 600;

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notesLoading, setNotesLoading] = useState(true);

  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  const filteredNotes = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  const handleAuth = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setNotes([]);
    setSelectedNoteId(null);
  };

  const loadNotes = async () => {
    try {
      setNotesLoading(true);
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleAddNote = async () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled note",
      content: "",
      createdAt: new Date().toISOString(),
    };
    try {
      await createNote(newNote);
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const timer = saveTimers.current.get(id);
      if (timer) {
        clearTimeout(timer);
        saveTimers.current.delete(id);
      }
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      if (selectedNoteId === id) setSelectedNoteId(null);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleUpdateNote = (changes: Partial<Note>) => {
    if (!selectedNote) return;
    const noteId = selectedNote.id;
    const updatedNote: Note = { ...selectedNote, ...changes };
    setNotes((prev) => prev.map((note) => (note.id === noteId ? updatedNote : note)));

    const existingTimer = saveTimers.current.get(noteId);
    if (existingTimer) clearTimeout(existingTimer);

    const timer = setTimeout(async () => {
      try {
        await updateNote(noteId, updatedNote);
      } catch (error) {
        console.error("Failed to save note:", error);
      } finally {
        saveTimers.current.delete(noteId);
      }
    }, SAVE_DELAY);

    saveTimers.current.set(noteId, timer);
  };

  useEffect(() => {
    if (token) loadNotes();
  }, [token]);

  useEffect(() => {
    return () => {
      saveTimers.current.forEach((timer) => clearTimeout(timer));
      saveTimers.current.clear();
    };
  }, []);

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  if (!token || !user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthPage onAuth={handleAuth} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Navbar
        onNewNote={handleAddNote}
        search={search}
        onSearchChange={setSearch}
        onMenuClick={() => setMobileOpen(true)}
        userEmail={user.email}
        onLogout={handleLogout}
      />

      <MainLayout
        sidebar={
          isMobile ? null : (
            <Sidebar
              notes={filteredNotes}
              search={search}
              selectedNoteId={selectedNoteId}
              onSearchChange={setSearch}
              onSelect={setSelectedNoteId}
              onDelete={handleDeleteNote}
              loading={notesLoading}
            />
          )
        }
        editor={
          notesLoading ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                background: "rgba(255,255,255,.72)",
              }}
            >
              <CircularProgress size={42} thickness={4} sx={{ color: "#f05d5e" }} />
            </Box>
          ) : selectedNote ? (
            <Editor note={selectedNote} onUpdate={handleUpdateNote} />
          ) : (
            <EmptyState onCreateNote={handleAddNote} />
          )
        }
      />

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "min(320px, 88vw)",
            boxSizing: "border-box",
          },
          background: "#f7f9f4",
        }}
      >
        <Sidebar
          notes={filteredNotes}
          search={search}
          selectedNoteId={selectedNoteId}
          onSearchChange={setSearch}
          onSelect={(id) => {
            setSelectedNoteId(id);
            setMobileOpen(false);
          }}
          onDelete={handleDeleteNote}
          loading={notesLoading}
        />
      </Drawer>
    </ThemeProvider>
  );
}

export default App;
