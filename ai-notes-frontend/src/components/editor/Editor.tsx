import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import TitleRoundedIcon from "@mui/icons-material/TitleRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import type { ReactNode } from "react";

import type { Note } from "../../types";
import { callAi, type AiAction } from "../../api/ai";

interface EditorProps {
  note: Note | null;
  onUpdate: (changes: Partial<Note>) => void;
}

const AI_ACTIONS: { label: string; action: AiAction; icon: ReactNode }[] = [
  { label: "Summarize",      action: "summarize",     icon: <SummarizeRoundedIcon /> },
  { label: "Rewrite",        action: "rewrite",       icon: <EditNoteRoundedIcon /> },
  { label: "Improve",        action: "improve",       icon: <AutoFixHighRoundedIcon /> },
  { label: "Translate",      action: "translate",     icon: <TranslateRoundedIcon /> },
  { label: "Generate Title", action: "generateTitle", icon: <TitleRoundedIcon /> },
  { label: "Enhance",        action: "enhance",       icon: <AutoAwesomeRoundedIcon /> },
];

const INLINE_ACTIONS: AiAction[] = ["rewrite", "improve", "generateTitle", "enhance"];

export default function Editor({
  note,
  onUpdate,
}: EditorProps) {
  const [aiResult, setAiResult]       = useState<string | null>(null);
  const [aiLabel, setAiLabel]         = useState("");
  const [, setAiAction]       = useState<AiAction | null>(null);
  const [loading, setLoading]         = useState<AiAction | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [pendingPreview, setPending]  = useState<{ action: AiAction; value: string } | null>(null);
  const [langDialog, setLangDialog]   = useState(false);
  const [language, setLanguage]       = useState("");
  
  useEffect(() => {
    setAiResult(null);
    setAiLabel("");
    setAiAction(null);
    setLoading(null);
    setError(null);
    setPending(null);
  }, [note?.id]);

  if (!note) return null;

  const handleTranslate = () => {
    setLanguage("");
    setLangDialog(true);
  };

  const runTranslate = async () => {
    if (!language.trim()) return;
    setLangDialog(false);
    await handleAiAction("Translate", "translate", language.trim());
  };

  const handleAiAction = async (label: string, action: AiAction, lang?: string) => {
    setLoading(action);
    setError(null);
    setAiResult(null);
    setPending(null);
    try {
      const result = await callAi(action, note.content, lang);
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
        borderRadius: { xs: 1.5, sm: 2 },
        overflow: "hidden",
        background:
          "linear-gradient(145deg,#ffffff 0%,#f5fbf7 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 3 },
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
              color: "#172b3a",
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
          flexWrap: { xs: "nowrap", sm: "wrap" },
          overflowX: { xs: "auto", sm: "visible" },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          gap: 1,
            px: { xs: 2, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            borderBottom: "1px solid #e2ebe5",
        }}
      >
        {AI_ACTIONS.map(({ label, action, icon }) => (
          <Box
            key={action}
            onClick={() => !loading && (action === "translate" ? handleTranslate() : handleAiAction(label, action))}
            sx={{
              px: 2,
              py: 0.8,
              borderRadius: "999px",
              border: "1px solid #dbe8df",
              background: loading === action ? "rgba(240,93,94,.14)" : "#f8fbf8",
              color: loading === action ? "#d84c59" : "text.secondary",
              fontSize: 13,
              cursor: loading ? "wait" : "pointer",
              transition: ".2s",
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              whiteSpace: "nowrap",
              flexShrink: 0,

              "&:hover": {
                background: "rgba(8,166,166,.10)",
              },
            }}
          >
            {loading === action
              ? <CircularProgress size={14} sx={{ color: "#d84c59" }} />
              : <Box sx={{ display: "flex", fontSize: 17 }}>{icon}</Box>}
            {label}
          </Box>
        ))}
      </Box>

      {/* Scrollable body: previews + editor */}
      <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Pending inline preview (rewrite / improve / generateTitle / enhance) */}
        {pendingPreview && (
          <Box
            sx={{
              mx: { xs: 2, sm: 4 },
              mt: 2,
              p: 2.5,
              borderRadius: 2,
              border: "1px solid rgba(8,166,166,.30)",
              background: "rgba(8,166,166,.06)",
            }}
          >
            <Typography sx={{ display: "flex", alignItems: "center", gap: 0.7, fontSize: 13, color: "#078f91", mb: 1.5, fontWeight: 600 }}>
              <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} /> Preview — approve to apply
            </Typography>
            <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: "#34505a", whiteSpace: "pre-wrap", mb: 2 }}>
              {pendingPreview.value}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button size="small" variant="contained"
                sx={{ background: "#f05d5e", "&:hover": { background: "#e74b59" }, textTransform: "none", fontSize: 13 }}
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
              mx: { xs: 2, sm: 4 },
              mt: 2,
              p: 2.5,
              borderRadius: 2,
              border: `1px solid ${error ? "rgba(248,113,113,.3)" : "rgba(99,102,241,.35)"}`,
              background: error ? "rgba(248,113,113,.08)" : "rgba(8,166,166,.06)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography sx={{ display: "flex", alignItems: "center", gap: 0.7, fontSize: 13, color: error ? "#d84c59" : "#078f91", fontWeight: 600 }}>
                <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} /> {aiLabel}
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
            <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: error ? "#d84c59" : "#34505a", whiteSpace: "pre-wrap" }}>
              {error ?? aiResult}
            </Typography>
          </Box>
        )}

        {/* Editor */}
        <Box sx={{ flex: 1, px: { xs: 2, sm: 4 }, py: { xs: 2, sm: 3 } }}>
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
                color: "#34505a",
              },

              "& textarea": {
                minHeight: { xs: "45vh !important", sm: "60vh !important" },
                resize: "none",
              },
            }}
          />
        </Box>

      </Box>

      <Divider />

      {/* Footer */}
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          py: { xs: 1.5, sm: 2 },
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
      <Dialog open={langDialog} onClose={() => setLangDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 16, fontWeight: 600 }}>Translate to</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="e.g. French, Hindi, Spanish…"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runTranslate()}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLangDialog(false)} sx={{ textTransform: "none", color: "text.secondary" }}>Cancel</Button>
          <Button onClick={runTranslate} variant="contained" disabled={!language.trim()}
            sx={{ textTransform: "none", background: "#f05d5e", "&:hover": { background: "#e74b59" } }}
          >
            Translate
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}