import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#f05d5e",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#08a6a6",
    },

    background: {
      default: "#f7f9f4",
      paper: "#ffffff",
    },

    text: {
      primary: "#172b3a",
      secondary: "#637480",
    },

    divider: "#e2ebe5",
  },

  typography: {
    fontFamily:
      '"Avenir Next", Avenir, "Segoe UI", sans-serif',

    h4: {
      fontWeight: 700,
      fontSize: "2rem",
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    subtitle1: {
      fontWeight: 600,
    },

    body1: {
      lineHeight: 1.8,
      fontSize: "1rem",
    },

    body2: {
      color: "#94A3B8",
    },
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#f7f9f4",
          backgroundImage:
            "radial-gradient(circle at 5% 0%, rgba(240,93,94,.12), transparent 26%), radial-gradient(circle at 95% 100%, rgba(8,166,166,.12), transparent 30%)",
        },

        "*::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },

        "*::-webkit-scrollbar-track": {
          background: "transparent",
        },

        "*::-webkit-scrollbar-thumb": {
          background: "#b9cbc2",
          borderRadius: "999px",
        },

        "*::-webkit-scrollbar-thumb:hover": {
          background: "#8ba99b",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(255,255,255,.88)",
          border: "1px solid #e2ebe5",
          boxShadow: "0 18px 45px rgba(38, 74, 62, .08)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,

          backgroundColor: "#fbfdfb",

          transition: "all .2s",

          "&:hover": {
            backgroundColor: "#ffffff",
          },

          "&.Mui-focused": {
            backgroundColor: "#ffffff",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,

          textTransform: "none",

          fontWeight: 600,

          paddingInline: 18,

          transition: ".25s",

          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,

          transition: ".2s",

          "&:hover": {
            backgroundColor: "rgba(8,166,166,.10)",
          },

          "&.Mui-selected": {
            background:
              "linear-gradient(90deg, rgba(240,93,94,.14), rgba(8,166,166,.12))",

            "&:hover": {
              background:
                "linear-gradient(90deg, rgba(240,93,94,.20), rgba(8,166,166,.16))",
            },
          },
        },
      },
    },
  },
});

export default theme;