// Centralized color system
export const colorPalette = {
  primary: {
    main: "#103766",
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
  grey: {
    light: "#b3b3b3",
    main: "#666666",
    dark: "#333333",
  },
};

// Mode-specific color configurations
export const colors = {
  light: {
    background: {
      default: "#F7F8F0",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
    button: {
      primary: "#103766",
      secondary: "#355872",
      hover: "#4a6fa5",
    },
  },
  dark: {
    background: {
      default: "#1a1a1a",
      paper: "#2d2d2d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
    button: {
      primary: "#4a6fa5",
      secondary: "#6a8ba3",
      hover: "#7ba0d8",
    },
  },
};

export default { colorPalette, colors };
