import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";

import type { Note } from "../../types";

interface NoteItemProps {
  note: Note;
  selected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export default function NoteItem({
  note,
  selected,
  onClick,
  onDelete,
}: NoteItemProps) {

  const date = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        p: 2,
        mb: 1.5,
        borderRadius: 1.5,
        cursor: "pointer",
        transition: "all .25s ease",
        background: selected
          ? "linear-gradient(135deg, rgba(240,93,94,.16), rgba(8,166,166,.12))"
          : "#f8fbf8",
        border: selected
          ? "1px solid rgba(240,93,94,.45)"
          : "1px solid #e2ebe5",

        "&:hover": {
          transform: "translateY(-2px)",
          background: "#ffffff",
          border: "1px solid rgba(8,166,166,.30)",
        },

        "&:hover .note-delete, &:focus-within .note-delete": {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 0.75,
        }}
      >
        <Typography
          sx={{
            minWidth: 0,
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            fontWeight: 700,
            fontSize: 16,
          }}
          noWrap
        >
          <NoteAltOutlinedIcon
            sx={{
              color: selected ? "#f05d5e" : "#08a6a6",
              fontSize: 18,
              flexShrink: 0,
            }}
          />
          {note.title || "Untitled"}
        </Typography>

        <Tooltip title="Delete">
          <IconButton
            className="note-delete"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{
              flexShrink: 0,
              width: 30,
              height: 30,
              opacity: 0,
              transition: "opacity .2s, color .2s, background-color .2s",

              "@media (hover: none)": {
                opacity: 1,
              },

              "&:hover": {
                color: "#ef4444",
                backgroundColor: "rgba(240,93,94,.10)",
              },
            }}
          >
            <DeleteSweepRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography
        sx={{
          color: "text.secondary",
          fontSize: 12,
        }}
      >
        {date}
      </Typography>
    </Box>
  );
}