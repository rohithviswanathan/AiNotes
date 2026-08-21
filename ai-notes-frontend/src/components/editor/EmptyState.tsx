import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import NoteAltRoundedIcon from "@mui/icons-material/NoteAltRounded";

interface EmptyStateProps {
  onCreateNote: () => void;
}

export default function EmptyState({
  onCreateNote,
}: EmptyStateProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        height: "100%",
        borderRadius: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(145deg,#ffffff 0%,#f0faf5 100%)",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 420,
          px: 4,
        }}
      >
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            mx: "auto",
            mb: 3,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            background:
              "linear-gradient(135deg,#f05d5e,#08a6a6)",

            boxShadow:
              "0 20px 50px rgba(240,93,94,.24)",

            animation: "emptyFloat 4s ease-in-out infinite",

            "@keyframes emptyFloat": {
              "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
              "50%": { transform: "translateY(-8px) rotate(3deg)" },
            },
          }}
        >
          <NoteAltRoundedIcon
            sx={{
              fontSize: 42,
              color: "#fff",
            }}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          No Note Selected
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            mb: 4,
            lineHeight: 1.8,
          }}
        >
          Select a note from the sidebar or create a new one
          to start writing.
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={onCreateNote}
          sx={{
            px: 3,
            py: 1.2,

            borderRadius: 999,

            background:
                "linear-gradient(90deg,#f05d5e,#08a6a6)",

            "&:hover": {
              background:
                "linear-gradient(90deg,#e74b59,#078f91)",
            },
          }}
        >
          Create Note
        </Button>
      </Box>
    </Paper>
  );
}