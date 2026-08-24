import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import InputBase from "@mui/material/InputBase";

interface NavbarProps {
  onNewNote: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
  userEmail: string;
  onLogout: () => void;
}

export default function Navbar({ onNewNote, search, onSearchChange, onMenuClick, userEmail, onLogout }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.86)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid #e2ebe5",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          px: {
            xs: 1.5,
            md: 4,
          },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        {/* Left Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flex: 1,
          }}
        >
          <IconButton
            onClick={isMobile ? onMenuClick : undefined}
            disableRipple={!isMobile}
            sx={{
              p: 0,
              mr: 1,

              "&:hover": {
                background: "transparent",
              },
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg,#f05d5e,#08a6a6)",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                color: "#fff",

                fontWeight: 700,

                fontSize: 18,

                animation: "logoPulse 3s ease-in-out infinite",

                "@keyframes logoPulse": {
                  "0%, 100%": { boxShadow: "0 0 0 0 rgba(240,93,94,.22)" },
                  "50%": { boxShadow: "0 0 0 8px rgba(8,166,166,0)" },
                },

                boxShadow:
                  "0 0 24px rgba(240,93,94,.24)",

                cursor: isMobile ? "pointer" : "default",
              }}
            >
              AI
            </Box>
          </IconButton>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#172b3a",
              }}
            >
              AI Notes
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: { xs: "none", sm: "block" },
              }}
            >
              Local First AI Workspace
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            alignItems: "center",
            gap: 1,
            width: 360,
            px: 2,
            py: 1,
            borderRadius: "999px",
            background: "#f4f8f4",
            border: "1px solid #dbe8df",
            transition: "0.25s",

            "&:hover": {
              background: "#ffffff",
            },

            "&:focus-within": {
              border: "1px solid #08a6a6",
              boxShadow: "0 0 0 3px rgba(8,166,166,.13)",
            },
          }}
        >
          <SearchRoundedIcon
            sx={{
              color: "text.secondary",
              fontSize: 20,
            }}
          />

          <InputBase
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            sx={{
              flex: 1,
              color: "#172b3a",
              fontSize: 14,

              "& input::placeholder": {
                color: "#7b8b92",
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            ml: 3,
          }}
        >
          {!isMobile && (
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {userEmail}
            </Typography>
          )}
          <Button
            variant="contained"
            startIcon={!isMobile ? <AddRoundedIcon /> : undefined}
            onClick={onNewNote}
            sx={{
              minWidth: isMobile ? 48 : "auto",
              px: isMobile ? 0 : 2.5,
              py: 1,
              borderRadius: 999,
              background: "linear-gradient(90deg,#f05d5e,#08a6a6)",
              "&:hover": { background: "linear-gradient(90deg,#e74b59,#078f91)" },
            }}
          >
            {isMobile ? <AddRoundedIcon /> : "New Note"}
          </Button>
          <Tooltip title="Logout">
            <IconButton onClick={onLogout} size="small" sx={{ color: "text.secondary" }}>
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}