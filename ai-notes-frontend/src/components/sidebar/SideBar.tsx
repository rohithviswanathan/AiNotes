import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";

import type { Note } from "../../types";
import NoteItem from "./NoteItem";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
//import SearchBar from "../common/SearchBar";

interface SidebarProps {
  notes: Note[];
  search: string;
  selectedNoteId: string | null;
  onSearchChange: (value: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function Sidebar({
  notes,
  //search,
  selectedNoteId,
  //onSearchChange,
  onSelect,
  onDelete,
  loading,
}: SidebarProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 320,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        background: "rgba(255,255,255,.90)",
      }}
    >
      <Box
        sx={{
          p: 2.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <NotesRoundedIcon sx={{ color: "#f05d5e", fontSize: 22 }} />
          Notes
        </Typography>

        {/* <SearchBar
            value={search}
            placeholder="Search notes..."
            onChange={onSearchChange}
        /> */}
      </Box>

      <Divider />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
        }}
      >
        {loading ? (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CircularProgress size={25} thickness={4} sx={{ color: "#f05d5e" }} />
            </Box>
            {[1, 2, 3, 4].map((item) => (
              <Box key={item} sx={{ mb: 1.5, p: 2, borderRadius: 1.5, border: "1px solid #e8f0ea" }}>
                <Skeleton animation="wave" variant="text" width="72%" height={24} sx={{ bgcolor: "rgba(8,166,166,.12)" }} />
                <Skeleton animation="wave" variant="text" width="38%" height={18} sx={{ bgcolor: "rgba(240,93,94,.10)" }} />
              </Box>
            ))}
          </Box>
        ) : notes.length === 0 ? (
          <Typography
            sx={{
              color: "text.secondary",
              textAlign: "center",
              mt: 6,
            }}
          >
            No notes found
          </Typography>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              selected={selectedNoteId === note.id}
              onClick={() => onSelect(note.id)}
              onDelete={() => onDelete(note.id)}
            />
          ))
        )}
      </Box>
    </Paper>
  );
}