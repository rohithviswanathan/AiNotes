import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface MainLayoutProps {
  sidebar: ReactNode;
  editor: ReactNode;
}

export default function MainLayout({
  sidebar,
  editor,
}: MainLayoutProps) {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "100svh", md: "100vh" },
        pt: { xs: "80px", md: "88px" }, // Space for fixed navbar
        px: { xs: 0, sm: 2, md: 3 },
        pb: { xs: 0, sm: 2, md: 3 },
        overflow: "hidden",
        background:
          "radial-gradient(circle at 5% 4%, rgba(240,93,94,.18), transparent 28%), radial-gradient(circle at 92% 8%, rgba(250,190,60,.14), transparent 24%), radial-gradient(circle at 88% 92%, rgba(8,166,166,.16), transparent 30%), radial-gradient(circle at 12% 88%, rgba(113,91,224,.10), transparent 22%), #f7f9f4",
        backgroundSize: "140% 140%",
        animation: "ambientShift 18s ease-in-out infinite alternate",
        "@keyframes ambientShift": {
          from: { backgroundPosition: "0% 0%, 100% 0%, 100% 100%, 0% 100%" },
          to: { backgroundPosition: "8% 8%, 92% 12%, 88% 86%, 12% 92%" },
        },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: { xs: 1.25, sm: 2, md: 3 },
          height: { xs: "100%", md: "100%" },
        }}
      >
        {/* Sidebar */}
        <Box
         sx={{
          display: {
            xs: "none",
            md: "block",
          },
          width: 340,
          flexShrink: 0,
         }}
        >
          {sidebar}
        </Box>

        {/* Editor */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            height: "100%",
          }}
        >
          {editor}
        </Box>
      </Box>
    </Box>
  );
}