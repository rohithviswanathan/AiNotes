import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

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
          ? "linear-gradient(135deg, rgba(99,102,241,.20), rgba(34,197,94,.12))"
          : "rgba(255,255,255,.02)",
        border: selected
          ? "1px solid rgba(99,102,241,.45)"
          : "1px solid rgba(255,255,255,.06)",

        "&:hover": {
          transform: "translateY(-2px)",
          background: "rgba(255,255,255,.05)",
          border: "1px solid rgba(99,102,241,.25)",
        },
      }}
    >
      <Tooltip title="Delete">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            opacity: 0,
            transition: ".2s",

            ".MuiBox-root:hover &": {
              opacity: 1,
            },

            "&:hover": {
              color: "#ef4444",
            },
          }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 16,
          pr: 4,
          mb: 0.75,
        }}
        noWrap
      >
        {note.title || "Untitled"}
      </Typography>

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