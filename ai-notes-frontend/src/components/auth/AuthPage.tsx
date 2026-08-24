import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { login, signup } from "../../api/auth";
import type { User } from "../../types";

interface AuthPageProps {
  onAuth: (token: string, user: User) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await login(email, password)
          : await signup(email, password);
      onAuth(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f9f4",
        backgroundImage:
          "radial-gradient(circle at 5% 0%, rgba(240,93,94,.12), transparent 26%), radial-gradient(circle at 95% 100%, rgba(8,166,166,.12), transparent 30%)",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              background: "linear-gradient(135deg,#f05d5e,#08a6a6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              boxShadow: "0 0 24px rgba(240,93,94,.24)",
            }}
          >
            AI
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#172b3a" }}>
            AI Notes
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, color: "#172b3a" }}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            slotProps={{
              htmlInput: {
                minLength: 6,
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.25,
              background: "linear-gradient(90deg,#f05d5e,#08a6a6)",
              "&:hover": {
                background: "linear-gradient(90deg,#e74b59,#078f91)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "text.secondary" }}
        >
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <Box
            component="span"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            sx={{
              color: "#f05d5e",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
}
