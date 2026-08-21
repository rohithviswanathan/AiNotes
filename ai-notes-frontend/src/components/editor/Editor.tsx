import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import type { Note } from "../../types";
import { callAi, type AiAction } from "../../api/ai";

interface EditorProps {
  note: Note | null;
  onUpdate: (changes: Partial<Note>) => void;
}

const AI_ACTIONS: { label: string; action: AiAction }[] = [
  { label: "Summarize",      action: "summarize"     },
  { label: "Rewrite",        action: "rewrite"       },
  { label: "Improve",        action: "improve"       },
  { label: "Translate",      action: "translate"     },
  { label: "Generate Title", action: "generateTitle" },
];

const INLINE_ACTIONS: AiAction[] = ["rewrite", "improve", "generateTitle"];

export default function Editor({
  note,
  onUpdate,
}: EditorProps) {
  const [aiResult, setAiResult]       = useState<string | null>(null);
  const [aiLabel, setAiLabel]         = useState("");
  const [aiAction, setAiAction]       = useState<AiAction | null>(null);
  const [loading, setLoading]         = useState<AiAction | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [pendingPreview, setPending]  = useState<{ action: AiAction; value: string } | null>(null);

  if (!note) return null;

  const handleAiAction = async (label: string, action: AiAction) => {
    setLoading(action);
    setError(null);
    setAiResult(null);
    setPending(null);
    try {
      const result = await callAi(action, note.content);
      if (INLINE_ACTIONS.includes(action)) {
        setPending({ action, value: result.trim() });
      } else {
        setAiLabel(label);
        setAiAction(action);
        setAiResult(result);
      }
    } catch (err: any) {
      setError(err.message);
      setAiLabel(label);
    } finally {
      setLoading(null);
    }
  };

  const approvePending = () => {
    if (!pendingPreview) return;
    if (pendingPreview.action === "generateTitle") {
      onUpdate({ title: pendingPreview.value });
    } else {
      onUpdate({ content: pendingPreview.value });
    }
    setPending(null);
  };

  const wordCount =
    note.content.trim() === ""
      ? 0
      : note.content.trim().split(/\s+/).length;

  const characterCount = note.content.length;

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        background:
          "linear-gradient(180deg,#111827 0%,#0F172A 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 4,
          py: 3,
        }}
      >
        <TextField
          multiline
          fullWidth
          variant="standard"
          placeholder="Untitled Note"
          value={note.title}
          onChange={(e) =>
            onUpdate({
              title: e.target.value,
            })
          }
          slotProps={{
            input: {
              disableUnderline: true,
            },
          }}
          sx={{
            mb: 1,

            "& .MuiInputBase-input": {
              fontSize: {xs: 28, sm: 34},
              fontWeight: 700,
              color: "#ffffff",
              padding: 0,
              lineHeight: 1.2,
            },
          }}
        />

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 13,
          }}
        >
          Created {new Date(note.createdAt).toLocaleString()}
        </Typography>
      </Box>

      <Divider />

      {/* AI Toolbar */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          px: 4,
          py: 2,
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        {AI_ACTIONS.map(({ label, action }) => (
          <Box
            key={action}
            onClick={() => !loading && handleAiAction(label, action)}
            sx={{
              px: 2,
              py: 0.8,
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,.08)",
              background: loading === action ? "rgba(99,102,241,.20)" : "rgba(255,255,255,.03)",
              color: loading === action ? "#a5b4fc" : "text.secondary",
              fontSize: 13,
              cursor: loading ? "wait" : "pointer",
              transition: ".2s",
              display: "flex",
              alignItems: "center",
              gap: 0.8,

              "&:hover": {
                background: "rgba(99,102,241,.12)",
              },
            }}
          >
            {loading === action
              ? <CircularProgress size={12} sx={{ color: "#a5b4fc" }} />
              : "✨"}
            {label}
          </Box>
        ))}
      </Box>

      {/* Pending inline preview (rewrite / improve / generateTitle) */}
      {pendingPreview && (
        <Box
          sx={{
            mx: 4,
            my: 2,
            p: 2.5,
            borderRadius: 2,
            border: "1px solid rgba(99,102,241,.35)",
            background: "rgba(99,102,241,.07)",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#a5b4fc", mb: 1.5, fontWeight: 600 }}>
            ✨ Preview — approve to apply
          </Typography>
          <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: "#e2e8f0", whiteSpace: "pre-wrap", mb: 2 }}>
            {pendingPreview.value}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" variant="contained"
              sx={{ background: "#6366f1", "&:hover": { background: "#4f46e5" }, textTransform: "none", fontSize: 13 }}
              onClick={approvePending}
            >
              Approve
            </Button>
            <Button size="small" variant="text"
              sx={{ color: "text.secondary", textTransform: "none", fontSize: 13 }}
              onClick={() => setPending(null)}
            >
              Discard
            </Button>
          </Box>
        </Box>
      )}

      {/* AI result panel (summarize / translate) */}
      {(aiResult || error) && (
        <Box
          sx={{
            mx: 4,
            my: 2,
            p: 2.5,
            borderRadius: 2,
            border: `1px solid ${error ? "rgba(248,113,113,.3)" : "rgba(99,102,241,.35)"}`,
            background: error ? "rgba(248,113,113,.06)" : "rgba(99,102,241,.07)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography sx={{ fontSize: 13, color: error ? "#f87171" : "#a5b4fc", fontWeight: 600 }}>
              ✨ {aiLabel}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {aiResult && (
                <Tooltip title="Copy">
                  <IconButton size="small" onClick={() => navigator.clipboard.writeText(aiResult!)} sx={{ color: "text.secondary" }}>
                    <ContentCopyRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton size="small" onClick={() => { setAiResult(null); setError(null); }} sx={{ color: "text.secondary" }}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: error ? "#f87171" : "#e2e8f0", whiteSpace: "pre-wrap" }}>
            {error ?? aiResult}
          </Typography>
        </Box>
      )}

      {/* Editor */}
      <Box
        sx={{
          flex: 1,
          px: 4,
          py: 3,
          overflowY: "auto",
        }}
      >
        <TextField
          multiline
          fullWidth
          variant="standard"
          placeholder="Start writing..."
          value={note.content}
          onChange={(e) =>
            onUpdate({
              content: e.target.value,
            })
          }
          slotProps={{
            input: {
              disableUnderline: true,
            },
          }}
          sx={{
            width: "100%",

            "& .MuiInputBase-root": {
              alignItems: "flex-start",
            },

            "& .MuiInputBase-input": {
              fontSize: 17,
              lineHeight: 1.9,
              color: "#E2E8F0",
            },

            "& textarea": {
              minHeight: "60vh !important",
              resize: "none",
            },
          }}
        />
      </Box>

      <Divider />

      {/* Footer */}
      <Box
        sx={{
          px: 4,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 13,
          }}
        >
          Words: {wordCount}
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 13,
          }}
        >
          Characters: {characterCount}
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 13,
          }}
        >
          Saved locally
        </Typography>
      </Box>
    </Paper>
  );
}