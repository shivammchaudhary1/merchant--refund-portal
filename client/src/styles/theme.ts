import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#134581",
      light: "#4a6fa5",
      dark: "#0a2547",
    },
    secondary: {
      main: "#355872",
      light: "#6a8ba3",
      dark: "#243d50",
    },
    common: {
      white: "#ffffff",
      black: "#000000",
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',

    h1: {
      fontSize: "32px",
      fontWeight: 700,
    },

    h2: {
      fontSize: "24px",
      fontWeight: 600,
    },

    body1: {
      fontSize: "14px",
    },
  },
});

export default theme;
